const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: `Bot invite link`,
			enabled: true,
		})
	}

	run(message) {
		message.send(`<https://bot.shaybox.com/${this.client.user.id}>\nIf you would like support, join my support server <https://discord.shaybox.com/>`)
	}
}