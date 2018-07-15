import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public constructor() {
		super({
			emitter: 'commandHandler',
		});
	}

	public async exec(error: Error, message: Message, command: Command) {
		await message.channel.send([
			'// An error has occurred,',
			'// It has been reported to the developer.',
			'// But here is the error in-case you know how to fix it:',
			error.message,
		], { code: 'js', split: { append: '```', prepend: '```js\n' } });

		await this.client.error([
			`Message Content: ${message.content}`,
			`Command: ${command.id}`,
			error.stack,
		].join('\n'));
	}
}