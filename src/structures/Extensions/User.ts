import fetch from 'node-fetch';
import Client from '../Client';

const { PORT, DBL_AUTH } = process.env;
if (!PORT || !DBL_AUTH) throw new Error('PORT and/or DBL_AUTH not provided');

export default (user: any) =>
	class extends user {
		public constructor(client: Client, data: any) {
			super(client, data);

			this.upvoted = undefined;
		}

		public async hasUpvoted() {
			if (this.upvoted === undefined) this.upvoted = await fetch(`http://localhost:${PORT}/user/${this.id}`, { headers: { Authorization: DBL_AUTH! } }).then(res => res.text()).then(text => parseInt(text, 10));

			return this.upvoted;
		}
	};