const
	{ MessageEmbed } = require(`discord.js`),
	{ Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			botPerms: [`EMBED_LINKS`],
			description: `Show name color`,
			enabled: true,
			extendedDescription: `Gives name color, if you have one.`,
			runIn: [`text`],
		})
	}

	run(message) {
		const colorRole = message.member.roles.find(`name`, `USER-${message.member.id}`)

		if (!colorRole) return message.send(`You don't a hex role`)

		message.send(new MessageEmbed()
			.setTitle(`**Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://shaybox-api.glitch.me/color/${colorRole.hexColor.replace(`#`, ``)}?width=150&height=50`)
			.setColor(colorRole.color)
		)
	}
}