const { Command } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			clientPermissions: [`SEND_MESSAGES`],
			description: `Support server`,
		})
	}

	exec(message) {
		message.channel.send(`If you would like support, join my support server <https://discord.shaybox.com/>`)
	}
}