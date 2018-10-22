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
			.get('/user/:id', this.authorized, async (req: IncomingMessage, res: ServerResponse) => {
				const userID = (req as any).params.id;

				if (
					(!this.users[userID]) ||
					(!this.users[userID].voted && (Date.now() - this.users[userID].time) > 300000) ||
					(this.users[userID].voted && (Date.now() - this.users[userID].time) > 86400000)
				) this.users[userID] = {
					...await this.fetch(`/bots/361796552165031936/check?userId=${userID}`),
					time: Date.now() - 82800000,
				};

				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(this.users[userID]));
			})
			.post('/webhook', this.authorized, (req: IncomingMessage, res: ServerResponse) => {
				const body = (req as any).body as { user: string };
				this.users[body.user] = { voted: true, time: Date.now() };
				manager.shards.first().eval(`this.upvote('${body.user}')`);

				res.end();
			});
	}

	public async spawn() {
		await this.server.listen(PORT);
		this.emit('ready', PORT);
	}

	private authorized(req: IncomingMessage, res: ServerResponse, next: () => void) {
		if (req.headers.authorization === DBL_AUTH) return next();
		res.status(401).end('Not authorized');
	}

	private fetch(endpoint: string) {
		return fetch('https://discordbots.org/api' + endpoint, { headers: { Authorization: DBL_API! } })
			.then(res => res.json());
	}
}
