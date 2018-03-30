const { MessageEmbed } = require(`discord.js`)
const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			botPerms: [`EMBED_LINKS`],
			description: `Show name color`,
			extendedDescription: `Gives name color, if you have one.`,
		})
	}

	run(message) {
		const colorRole = message.member.roles.find(`name`, `USER-${message.member.id}`)

		if (!colorRole) return message.send(`You don't a hex role`)

		message.send(new MessageEmbed()
			.setTitle(`✅ **Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setColor(colorRole.color)
		)
	}
}