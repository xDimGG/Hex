import { Event } from 'klasa';
import { TextChannel } from 'discord.js';
import { post } from 'snekfetch';

export default class extends Event {
	async run() {
		if (process.env.DEV) return;

		const consoleChannel = this.client.channels.get('361533828520476684') as TextChannel;
		if (consoleChannel) await consoleChannel.send(this.client.user.tag);

		post(`https://discordbots.org/api/bots/${this.client.user.id}/stats`, {
			data: {
				server_count: this.client.guilds.size,
				shard_count: this.client.shard.count,
				shard_id: this.client.shard.id
			},
			headers: { Authorization: process.env.DBL_API }
		});
	}
}
