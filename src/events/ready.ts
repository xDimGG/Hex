import fetch from 'node-fetch';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public async exec() {
		console.log(this.client.user.tag);

		if (process.env.DEV) return;

		const guildCount = (await this.client.shard.broadcastEval('this.guilds.size')).reduce((a: number, b: number) => a + b, 0);
		await this.client.user.setPresence({
			activity: {
				name: `${guildCount} ${guildCount === 0 ? 'Guild' : 'Guilds'}`,
				type: 'WATCHING',
				url: 'https://twitch.tv/monstercat',
			},
		});

		const { DBL_API, DBOTS_API } = process.env;
		if (!DBL_API || !DBOTS_API) return console.error('API Keys not set');

		await fetch(`https://discordbots.org/api/bots/${this.client.user.id}/stats`, {
			body: JSON.stringify({
				server_count: this.client.guilds.size,
				shard_count: this.client.shard.count,
				shard_id: this.client.shard.id,
			}),
			headers: {
				'Authorization': process.env.DBL_API!,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		});
		await fetch(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`, {
			body: JSON.stringify({
				server_count: this.client.guilds.size,
				shard_count: this.client.shard.count,
				shard_id: this.client.shard.id,
			}),
			headers: {
				'Authorization': process.env.DBOTS_API!,
				'Content-Type': 'application/json',
			},
			method: 'POST',
		});
	}
}