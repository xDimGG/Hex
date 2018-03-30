const { MessageEmbed } = require(`discord.js`)
const { Command } = require(`klasa`)

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

		if (!colorRole)
			return message.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`You dont have one!`)
				.setColor(0xFF0000)
			)

		colorRole.delete().then(role => {
			message.send(new MessageEmbed()
				.setTitle(`✅ **Removed ${role.hexColor.toUpperCase().replace(`#`, ``)}**`)
				.setColor(role.color)
			)
		}).catch(error => {
			message.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`\`\`\`\n${error}\n\`\`\``)
				.setColor(0xFF0000)
			)
		})

		return undefined
	}
}