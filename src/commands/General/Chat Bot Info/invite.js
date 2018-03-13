const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, { description: `Bot invite link` })
	}

	run(message) {
		message.send(`<https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8>`)
	}
}