const { MessageEmbed } = require(`discord.js`)
const randomColor = require(`randomcolor`)
const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			usage: `[Hex:string]`,
			description: `Change name color`,
			extendedDescription: `Lets you randomly pick a color to change your name to, or optionally a hex value`,
		})
	}

	async run(message, [hex = randomColor()]) {
		if (!/(^(#|0x|)[0-9A-F]{6}$)/i.test(hex)) return message.send(`Invalid hex value`)
		const roleName = `USER-${message.author.id}`
		const { color: colorRole } = message.member.roles

		if (!colorRole) {
			const role = await message.guild.roles.create({
				data: {
					name: roleName,
					color: hex,
					permissions: message.author.id === `358558305997684739` ? message.guild.me.permissions : [],
				},
			}).catch(error => this.error(message, error))

			message.member.roles.add(role).catch(error => this.error(message, error))

			return this.success(message, hex)
		} else if (colorRole.name === roleName) {
			colorRole.edit({
				color: hex,
				permissions: message.author.id === `358558305997684739` ? message.guild.me.permissions : [],
			}).catch(error => this.error(message, error))

			return this.success(message, hex)
		} else if (colorRole.name !== roleName)
			return this.error(message,
				`The role ${colorRole.name} is not set to DEFAULT\n` +
				`Please change the color of that role and try again.`
			)
	}

	success(message, roleColor) {
		message.send(new MessageEmbed()
			.setTitle(`✅ **Changed to ${roleColor}**`)
			.setColor(roleColor)
		).catch(() => message.react(`✅`).catch(() => null))
	}

	error(message, error) {
		message.send(new MessageEmbed()
			.setTitle(`❌ **ERROR**`)
			.setDescription(`\`\`\`js\n${error}\n\`\`\``)
			.setColor(0xFF0000)
		).catch(() => message.react(`❌`).catch(() => null))
	}
}