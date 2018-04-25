const Command = require('../../structures/Command');

module.exports = class extends Command {
	constructor() {
		super({ clientPermissions: ['SEND_MESSAGES'] });
	}

	exec(message) {
		const output = [];
		const allCommands = this.handler.modules.filter(c => !c.ownerOnly && c.id !== 'help').sort();
		const longest = allCommands.keyArray().reduce((long, str) => Math.max(long, str.length), 0);

		this.handler.categories.forEach(category => {
			const commands = category.filter(c => !c.ownerOnly && c.id !== 'help').sort();

			if (commands.size < 1) return;

			output.push(`= ${category.id} =`);
			output.push(commands.map(c => `${this.upperCase(c.id)}${' '.repeat(longest - c.id.length)} :: ${c.description}`).sort().join('\n'));
		});

		message.channel.send(output.join('\n'), { code: 'asciidoc', split: { append: '```', prepend: '```asciidoc\n' } });
	}

	upperCase(input) {
		return input[0].toUpperCase() + input.slice(1);
	}
};