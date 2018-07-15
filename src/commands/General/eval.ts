import { Message } from 'discord.js';
import { inspect } from 'util';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			args: [{ id: 'code' }],
			description: 'Evaluates javascript code',
			ownerOnly: true,
		});
	}

	public async exec(message: Message, { code }: { code: string }) {
		if (!code) return message.channel.send('Please provide code to eval');

		let output: any;
		try {
			const evaled = eval(code);
			output = inspect(evaled instanceof Promise ? await evaled : evaled);
		} catch (error) {
			output = inspect(error);
		}

		for (const env in process.env)
			if (['TOKEN', 'DATABASE', 'CLEVERBOT_USER', 'CLEVERBOT_KEY'].includes(env)) output = output.replace(process.env[env], '[SECRET!]');

		await message.channel.send(
			output.length > 2000 ? '' : output,
			output.length > 2000 ? { files: [{ attachment: Buffer.from(output), name: 'output.txt' }] } : { code: 'js' },
		);
	}
}