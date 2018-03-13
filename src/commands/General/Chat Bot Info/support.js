const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, { description: `Bot support server` })
	}

	run(message) {
		message.send(`If you would like support, join my support server <https://discord.shaybox.com/>`)
	}
}