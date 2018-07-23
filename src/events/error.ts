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
			'// Please report it to the developer.',
			'// https://discord.shaybox.com/',
			error.stack,
		], { code: 'js', split: { append: '```', prepend: '```js\n' } });
	}
}