import * as bodyParser from 'body-parser';
import { ShardingManager } from 'discord.js';
import { EventEmitter } from 'events';
import { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';
import * as polka from 'polka';

const { PORT, DBL_API, DBL_AUTH } = process.env;
if (!PORT || !DBL_API || !DBL_AUTH) throw new Error('PORT, DBL_API, and/or DBL_AUTH not provided');

export default class extends EventEmitter {
	private server: any;
	private users: { [index: string]: { time: number; voted: boolean } };
	public constructor(manager: ShardingManager) {
		super();
		this.users = {};
		this.server = polka()
			.use(bodyParser.json())
			.get('/user/:id', async (req: IncomingMessage, res: ServerResponse) => {
				if (req.headers.authorization !== DBL_AUTH) return res.end('Not authorized');

				const userID = (req as any).params.id;

				if (
					(!this.users[userID]) ||
					(this.users[userID].voted === false && (new Date().getTime() - this.users[userID].time) > 300000) ||
					(this.users[userID].voted === true && (new Date().getTime() - this.users[userID].time) > 86400000)
				) this.users[userID] = {
						...await this.fetch(`/bots/361796552165031936/check?userId=${userID}`),
						time: new Date().getTime() - 82800000,
					};

				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(this.users[userID]));
			})
			.post('/webhook', (req: IncomingMessage, res: ServerResponse) => {
				if (req.headers.authorization !== DBL_AUTH) return res.end();

				const body = (req as any).body as { user: string };
				this.users[body.user] = { voted: true, time: new Date().getTime() };
				manager.broadcastEval(`if (this.shard.id === 0) { this.upvote('${body.user}') }`);

				res.end();
			});
	}

	public async spawn() {
		await this.server.listen(PORT);
		this.emit('ready', PORT);
	}

	private fetch(endpoint: string) {
		return fetch('https://discordbots.org/api' + endpoint, { headers: { Authorization: DBL_API! } })
			.then(res => res.json());
	}
}