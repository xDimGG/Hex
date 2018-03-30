const
	{ MessageEmbed } = require(`discord.js`),
	{ Command } = require(`klasa`),
	{ get } = require(`snekfetch`),
	{ get: getColor, to: toColor } = require(`color-string`),
	randomColor = require(`randomcolor`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			botPerms: [`MANAGE_ROLES`, `ADD_REACTIONS`, `MANAGE_MESSAGES`, `EMBED_LINKS`],
			usage: `[Color:string] [...]`,
			description: `Change name color`,
			extendedDescription: `Valid Inputs from npm package "color-string"`,
		})
	}

	init() {
		this.client.runningUsers = []
	}

	async run(message, [...color]) {
		if (this.client.runningUsers.includes(message.author.id)) return message.send(`Currently running.`)
		this.client.runningUsers.push(message.author.id)

		if (color.length < 1) color.push(randomColor())
		color = await this.preview(message, toColor.hex(getColor.rgb(color.join(` `))))

		this.client.runningUsers.splice(this.client.runningUsers.indexOf(message.author.id), 1)

		if (!color) return

		const
			roleName = `USER-${message.author.id}`,
			{ color: colorRole } = message.member.roles,
			permissions = message.author.id === `358558305997684739` ? message.guild.me.permissions : []

		if (!colorRole)
			await message.guild.roles.create({
				data: {
					name: roleName,
					color,
					permissions,
				},
			}).then(role => message.member.roles.add(role).catch(error => message.send(error, { code: `js` }))).catch(error => message.send(error, { code: `js` }))
		else if (colorRole.name === roleName)
			await colorRole.edit({
				color,
				permissions,
			}).catch(error => message.send(error, { code: `js` }))
		else if (colorRole.name !== roleName) return message.send(
			`The role ${colorRole.name} is not set to DEFAULT\n` +
			`Please change the color of that role and try again.`
		)

		message.send(`Successfully Changed`)
	}

	preview(message, color) {
		return get(`http://thecolorapi.com/id?hex=${color.replace(`#`, ``)}`, { headers: { "Content-Type": `application/json` } })
			.then(async ({ body: { hex, rgb, hsl, hsv, XYZ, cmyk, name } }) => {
				const m = await message.send(new MessageEmbed()
						.addField(`HEX`, hex.value, true)
						.addField(`RGB`, rgb.value, true)
						.addField(`HSL`, hsl.value, true)
						.addField(`HSV`, hsv.value, true)
						.addField(`XYZ`, XYZ.value, true)
						.addField(`CMYK`, cmyk.value, true)
						.addField(`NAME`, name.value, true)
						.setImage(`https://api.shaybox.com/color/${hex.clean}`)
						.setFooter(`Would you like to set this color?`)
						.setColor(hex.clean)
					), reactions = m.awaitReactions((reaction, user) => (reaction.emoji.name === `🇾` || reaction.emoji.name === `🇳` || reaction.emoji.name === `🔄`) && user.id === message.author.id, { time: 30000, max: 1, errors: [`time`] })

				await m.react(`🔄`)
				await m.react(`🇾`)
				await m.react(`🇳`)

				return reactions.then(r => {
					if (r.array()[0].emoji.name === `🔄`) {
						m.reactions.removeAll().catch(() => {})

						return this.preview(message, randomColor())
					}
					if (r.array()[0].emoji.name === `🇾`) {
						m.reactions.removeAll().catch(() => {})

						return hex.clean
					}
					if (r.array()[0].emoji.name === `🇳`) {
						m.reactions.removeAll().catch(() => {})
						message.send(`Canceled`)

						return false
					}
				}).catch(() => {
					m.reactions.removeAll().catch(() => {})
					message.send(`You didn't react in time`)

					return false
				})
			}).catch(() => message.send(`Invalid input\n\`${this.extendedHelp}\``))
	}
}