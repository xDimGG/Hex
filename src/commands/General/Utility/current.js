const
	{ MessageEmbed } = require(`discord.js`),
	{ Command } = require(`klasa`)

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
			.setTitle(`**Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://api.shaybox.com/color/${colorRole.hexColor.replace(`#`, ``)}?width=140&height=50`)
			.setColor(colorRole.color)
		)
	}
}