const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			description: `Bot invite link`,
		})
	}

	run(message) {
		message.send(`<https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8>\nIf you would like support, join my support server <https://discord.shaybox.com/>`)
	}
}