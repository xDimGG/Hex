import { Event } from 'klasa';
import { TextChannel } from 'discord.js';

export default class extends Event {
	async run(error: Error) {
		const consoleChannel = this.client.channels.get('361533828520476684') as TextChannel;
		if (consoleChannel) await consoleChannel.send(error, { code: 'js' });
	}
}
