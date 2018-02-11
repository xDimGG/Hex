const { Command } = require(`discord-akairo`)
const { basename, sep } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Shows all commands`,
			typing: true,
		})
	}

	async exec(message) {
		return message.channel.send(this.handler.modules.filter(c => !c.ownerOnly).sort().map(c => `**${this.upperCase(c.id)}** - ${c.description}`).join(`\n`))
	}

	upperCase(input) {
		return input[0].toUpperCase() + input.slice(1)
	}
}