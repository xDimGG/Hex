import { Message } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			aliases: ['commands'],
			description: 'Shows all available commands',
		});
	}

	public async exec(message: Message) {
		const commandFilter = (command: Command) => command.id !== 'help' && !command.ownerOnly;
		const allCommands = this.handler.modules.filter(commandFilter).sort();
		const longest = allCommands.keyArray().reduce((long, str) => Math.max(long, str.length), 0);
		const output: string[] = [];

		this.handler.categories.forEach(category => {
			output.push(`= ${category.id} =`);
			category.filter(commandFilter).forEach(command => {
				output.push(`${command.id}${' '.repeat(longest - command.id.length)} :: ${command.description}`);
			});
			output.push('');
		});

		await message.channel.send(output, { code: 'asciidoc', split: { append: '```', prepend: '```asciidoc\n' } });
	}
}