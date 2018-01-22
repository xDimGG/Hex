const { Command } = require(`discord-akairo`);
const { basename, sep } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			description: `Shows all commands`,
			typing: true,
			hide: true
		});
	}

	async exec(message) {
		const commandNames = this.handler.modules.filter(c => !c.hide).sort();
		const longest = commandNames.keyArray().reduce((long, str) => Math.max(long, str.length), 0);
		return message.channel.send(
			`= Command List =\n` +
			`\n` +
			`${commandNames.map(c => `${this.upperCase(c.id)}${` `.repeat(longest - c.id.length)} :: ${c.description}`).sort().join(`\n`)}`,
			{
				code: `asciidoc`,
				split: { prepend: `\`\`\`asciidoc\n`, append: `\`\`\`` }
			}
		);
	}

	upperCase(input) {
		return input.charAt(0).toUpperCase() + input.slice(1);
	}
}

module.exports = This;
