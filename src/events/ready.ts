import fetch from 'node-fetch';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public constructor() {
		super({
			emitter: 'client',
		});
	}

	public async exec() {
		console.log(this.client.user.tag);

		if (process.env.DEV) return;

		const { DBL_API, DBOTS_API } = process.env;
		if (!DBL_API || !DBOTS_API) return console.error('API Keys not set');

		[
			[DBL_API, 'https://discordbots.org'],
			[DBOTS_API, 'https://bots.discord.pw'],
		].forEach(async ([key, url]) =>
			fetch(`${url}/api/bots/${this.client.user.id}/stats`, {
				body: JSON.stringify({
					server_count: this.client.guilds.size,
					shard_count: this.client.shard.count,
					shard_id: this.client.shard.id,
				}),
				headers: {
					'Authorization': key,
					'Content-Type': 'application/json',
				},
				method: 'POST',
			})
		);

		if (this.client.shard.id !== this.client.shard.count) return;

		const guildCount = (await this.client.runCommand('this.guilds.size')).reduce((a: number, b: number) => a + b, 0);
		await this.client.runCommand(`this.user.setPresence({ activity: { name: "${guildCount} ${guildCount === 0 ? 'Guild' : 'Guilds'}", type: "WATCHING" } })`);
	}
}