const { MessageEmbed } = require(`discord.js`)
const randomColor = require(`randomcolor`)
const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			usage: `[Hex:regex/#?([\\da-f]{6})/i]`,
			description: `Change name color`,
			extendedDescription: `Lets you randomly pick a color to change your name to, or optionally a hex value`,
		})
	}

	run(message, [hex = randomColor()]) {
		const roleName = `USER-${message.author.id}`
		const { color: colorRole } = message.member.roles

		if (!colorRole)
			message.guild.roles.create({
				data: {
					name: roleName,
					color: hex,
					permissions: [],
				},
			}).then(role => {
				message.member.roles.add(role).catch(error => this.error(message, error))

				return this.success(message, hex)
			}).catch(error => this.error(message, error))
		else if (colorRole.name === roleName)
			colorRole.setColor(hex)
				.then(() => this.success(message, hex))
				.catch(error => this.error(message, error))
		else if (colorRole.name !== roleName)
			return this.error(message,
				`The role ${colorRole.name} is not set to DEFAULT\n` +
				`Please change the color of that role and try again.`
			)

		return undefined
	}

	success(message, roleColor) {
		message.channel.send(new MessageEmbed()
			.setTitle(`✅ **Changed to ${roleColor}**`)
			.setColor(roleColor)
		).catch(() => message.react(`✅`).catch(() => null))
	}

	error(message, error) {
		message.channel.send(new MessageEmbed()
			.setTitle(`❌ **ERROR**`)
			.setDescription(`\`\`\`js\n${error}\n\`\`\``)
			.setColor(0xFF0000)
		).catch(() => message.react(`❌`).catch(() => null))
	}
}