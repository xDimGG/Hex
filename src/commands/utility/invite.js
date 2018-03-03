const { Command } = require(`discord-akairo`)
const { basename, sep } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Gives bot invite`,
			typing: true,
		})
	}

	exec(message) {
		message.channel.send(`<https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8>`)
	}
}