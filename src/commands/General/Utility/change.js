const { MessageEmbed } = require(`discord.js`)
const randomColor = require(`randomcolor`)
const { Command } = require(`klasa`)
const { get } = require(`snekfetch`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			usage: `[Color:string] [...]`,
			description: `Change name color`,
			extendedDescription: `Lets you randomly pick a color to change your name to, or optionally a HEX, RGB, HSL, or CMYK value`,
		})
	}

	async run(message, [...color]) {
		if (this.client.temp.disabledUsers.includes(message.author.id)) return message.send(`Command disabled, currently running.`)
		this.client.temp.disabledUsers.push(message.author.id)

		if (color.length === 0) color.push(randomColor())
		color = await this.preview(message, color.join(``))

		this.client.temp.disabledUsers.splice(this.client.temp.disabledUsers.indexOf(message.author.id), 1)

		if (!color) return

		const roleName = `USER-${message.author.id}`
		const { color: colorRole } = message.member.roles

		try {
			if (!colorRole)
				message.guild.roles.create({
					data: {
						name: roleName,
						color,
						permissions: message.author.id === `358558305997684739` ? message.guild.me.permissions : [],
					},
				}).then(role => message.member.roles.add(role))
			else if (colorRole.name === roleName)
				colorRole.edit({
					color,
					permissions: message.author.id === `358558305997684739` ? message.guild.me.permissions : [],
				})
			else if (colorRole.name !== roleName)
				throw Error(
					`The role ${colorRole.name} is not set to DEFAULT\n` +
					`Please change the color of that role and try again.`
				)

			message.send(new MessageEmbed()
				.setTitle(`✅ **Changed to ${color}**`)
				.setColor(color)
			).catch(() => message.react(`✅`).catch(() => null))
		} catch (error) {
			message.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`\`\`\`js\n${error}\n\`\`\``)
				.setColor(0xFF0000)
			).catch(() => message.react(`❌`).catch(() => null))
		}
	}

	preview(message, color, i = 1) {
		if (i > 30) {
			message.send(`God damn, pick a color!`).reactions.removeAll()

			return false
		}

		const type = color.includes(`rgb`) ? `rgb` : color.includes(`hsl`) ? `hsl` : `hex`

		return get(`http://thecolorapi.com/id?${type}=${color.replace(`#`, ``).replace(`0x`, ``).replace(`rgb(`, ``).replace(`hsl(`, ``).replace(`cmyk(`, ``).replace(`)`, ``)}`, { headers: { "Content-Type": `application/json` } })
			.then(async ({ body: { hex, rgb, hsl, hsv, XYZ, cmyk, name } }) => {
				const m = await message.send(new MessageEmbed()
					.addField(`HEX`, hex.value, true)
					.addField(`RGB`, rgb.value, true)
					.addField(`HSL`, hsl.value, true)
					.addField(`HSV`, hsv.value, true)
					.addField(`XYZ`, XYZ.value, true)
					.addField(`CMYK`, cmyk.value, true)
					.addField(`NAME`, name.value, true)
					.setImage(`http://placehold.it/500.png/${hex.clean}/${hex.clean}`)
					.setFooter(`Would you like to set this color?`)
					.setColor(hex.clean)
				)

				const reactions = m.awaitReactions((reaction, user) => (reaction.emoji.name === `🇾` || reaction.emoji.name === `🇳` || reaction.emoji.name === `🔄`) && user.id === message.author.id, { time: 30000, max: 1, errors: [`time`] })

				await m.react(`🔄`)
				await m.react(`🇾`)
				await m.react(`🇳`)

				return reactions.then(r => {
					if (r.array()[0].emoji.name === `🔄`) {
						m.reactions.removeAll()

						return this.preview(message, randomColor(), false, i++)
					}
					if (r.array()[0].emoji.name === `🇾`) {
						m.reactions.removeAll()

						return hex.clean
					}
					if (r.array()[0].emoji.name === `🇳`) {
						m.reactions.removeAll()
						message.send(`Canceled`)

						return false
					}
				}).catch(() => {
					m.reactions.removeAll()
					message.send(`You didn't react in time`)

					return false
				})
			}).catch(() => message.send(`Invalid input`))
	}
}