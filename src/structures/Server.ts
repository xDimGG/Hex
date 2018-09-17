import * as bodyParser from 'body-parser';
import { EventEmitter } from 'events';
import { ServerRequest, ServerResponse } from 'http';
import fetch from 'node-fetch';
import * as polka from 'polka';

const { PORT, DBL_API, DBL_AUTH } = process.env;
if (!PORT || !DBL_API || !DBL_AUTH) throw new Error('PORT, DBL_API, and/or DBL_AUTH not provided');

export default class extends EventEmitter {
	private server: any;
	private users: { [index: string]: { time: number; voted: boolean } };
	public constructor() {
		super();
		this.users = {};
		this.server = polka()
			.use(bodyParser.json())
			.get('/user/:id', async (req: ServerRequest, res: ServerResponse) => {
				if (req.headers.authorization !== DBL_AUTH) return res.end('Not authorized');
				console.log('Check');

				const userID = (req as any).params.id;
				if (this.users[userID] === undefined || (new Date().getTime() - this.users[userID].time) > 86400000) this.users[userID] = {
					...await this.fetch(`/bots/361796552165031936/check?userId=${userID}`),
					time: new Date().getTime() - 82800000,
				};

				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(this.users[userID]));
			})
			.post('/webhook', (req: ServerRequest, res: ServerResponse) => {
				if (req.headers.authorization !== DBL_AUTH) return res.end();
				console.log('Webhook');

				const body = (req as any).body as { user: string };
				this.users[body.user] = { voted: true, time: new Date().getTime() };
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