import { Event } from 'klasa';
import { TextChannel } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Event {
	async run() {
		if (process.env.DEV || !process.env.DBL_API || !process.env.DBOTS_API) return;

		const consoleChannel = this.client.channels.get('361533828520476684') as TextChannel;
		if (consoleChannel) await consoleChannel.send(this.client.user.tag);

		await fetch(`https://discordbots.org/api/bots/${this.client.user.id}/stats`, {
			method: 'POST',
			body: JSON.stringify({ server_count: this.client.guilds.size }),
			headers: { 'Content-Type': 'application/json', 'Authorization': process.env.DBL_API },
		});
		await fetch(`https://bots.discord.pw/api/bots/${this.client.user.id}/stats`, {
			method: 'POST',
			body: JSON.stringify({ server_count: this.client.guilds.size }),
			headers: { 'Content-Type': 'application/json', 'Authorization': process.env.DBOTS_API },
		});
	}
}
