import fetch from 'node-fetch';
import Client from '../Client';

const { PORT, DBL_AUTH } = process.env;
if (!PORT || !DBL_AUTH) throw new Error('PORT and/or DBL_AUTH not provided');

export default (extensionClass: any) =>
	class extends extensionClass {
		public constructor(client: Client, data: any) {
			super(client, data);
		}

		public async hasUpvoted() {
			return fetch(`http://localhost:${PORT}/user/${this.id}`, { headers: { Authorization: DBL_AUTH! } }).then(res => res.text()).then(text => parseInt(text, 10));
		}
	};