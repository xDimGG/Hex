import { Message } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			description: 'Shows upvote link',
		});
	}

	public async exec(message: Message) {
		await message.channel.send('If you want to upvote to make me more popular, <https://discordbots.org/bot/361796552165031936/vote>');
	}
}