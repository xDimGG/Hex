import { Message } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			description: 'Shows bot & support server invite links',
		});
	}

	public async exec(message: Message) {
		await message.channel.send([
			`Bot invite: <https://bot.shaybox.com/${this.client.user.id}>`,
			'Support server invite: <https://discord.shaybox.com/>',
		]);
	}
}