const
	{ MessageEmbed } = require(`discord.js`),
	{ Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			botPerms: [`MANAGE_ROLES`, `EMBED_LINKS`],
			description: `Remove name color`,
			extendedDescription: `Deletes the role that gives your name color, if you have one.`,
		})
	}

	run(message) {
		const colorRole = message.member.roles.find(`name`, `USER-${message.member.id}`)

		if (!colorRole) return message.send(`You don't a hex role`)

		colorRole.delete().then(() => {
			message.send(new MessageEmbed()
				.setTitle(`**Removed ${colorRole.hexColor.toUpperCase()}**`)
				.setImage(`https://shaybox-api.glitch.me/color/${colorRole.hexColor.replace(`#`, ``)}?width=140&height=50`)
				.setColor(colorRole.color)
			)
		}).catch(error => {
			message.send(error, { code: `js` })
		})
	}
}