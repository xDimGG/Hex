const
	{ Command } = require(`discord-akairo`),
	{ basename } = require(`path`)

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			clientPermissions: [`SEND_MESSAGES`],
		})
	}

	exec(message) {
		const output = []
		this.handler.categories.forEach(category => {
			const
				commandNames = category.filter(c => !c.ownerOnly && c.id !== `help`).sort(),
				longest = commandNames.keyArray().reduce((long, str) => Math.max(long, str.length), 0)

			if (commandNames.size < 1) return

			output.push(`= ${category.id} =`)
			output.push(commandNames.map(c => `${this.upperCase(c.id)}${` `.repeat(longest - c.id.length)} :: ${c.description}`).sort().join(`\n`))
		})

		message.channel.send(output.join(`\n`), { code: `asciidoc`, split: { append: `\`\`\``, prepend: `\`\`\`asciidoc\n` } })
	}

	upperCase(input) {
		return input[0].toUpperCase() + input.slice(1)
	}
}