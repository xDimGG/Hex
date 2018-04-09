const { Command } = require(`klasa`)

module.exports = class This extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			description: `Bot invite link`,
		})
	}

	run(message) {
		message.send(`<https://bot.shaybox.com/${this.client.user.id}>\nIf you would like support, join my support server <https://discord.shaybox.com/>`)
	}
}