const
	{ Command } = require(`discord-akairo`),
	{ basename } = require(`path`)

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			clientPermissions: [`SEND_MESSAGES`],
			description: `Bot and Support server invite link`,
		})
	}

	exec(message) {
		message.send(`<https://bot.shaybox.com/${this.client.user.id}>\nIf you would like support, join my support server <https://discord.shaybox.com/>`)
	}
}