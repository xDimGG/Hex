import { Message } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			description: 'Shows all available commands',
		});
	}

	public async exec(message: Message) {
		const allCommands = this.handler.modules.filter(c => c.id !== 'help' && !c.ownerOnly).sort();
		const longest = allCommands.keyArray().reduce((long, str) => Math.max(long, str.length), 0);
		const output: string[] = [];

		this.handler.categories.forEach(category => {
			output.push(`= ${category.id} =`);
			category.map(command => {
				output.push(`${command.id}${' '.repeat(longest - command.id.length)} :: ${command.description}`);
			});
			output.push('');
		});

		await message.channel.send(output, { code: 'asciidoc', split: { append: '```', prepend: '```asciidoc\n' } });
	}
}