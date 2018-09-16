import fetch from 'node-fetch';
import Client from '../Client';

export default (user: any) =>
	class extends user {
		public constructor(client: Client, data: any) {
			super(client, data);

			this.upvoted = undefined;
		}

		public async hasUpvoted() {
			if (this.upvoted === undefined) this.upvoted = await fetch(`http://localhost/user/${this.id}`, { headers: { Authorization: process.env.DBL_AUTH! } }).then(res => res.text()).then(text => parseInt(text, 10));

			return this.upvoted;
		}
	};