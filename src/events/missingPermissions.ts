import { Command } from 'discord-akairo';
import { Message, PermissionResolvable } from 'discord.js';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public constructor() {
		super({
			emitter: 'commandHandler',
		});
	}

	public async exec(message: Message, command: Command, type: string, missing: PermissionResolvable[]) {
		await message.channel.send(`${type === 'client' ? 'I am' : 'You are'} missing permissions: ${missing.join(' ')}`);
	}
}