const { MessageEmbed } = require(`discord.js`)
const randomColor = require(`randomcolor`)
const { Command } = require(`klasa`)
const { get } = require(`snekfetch`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			botPerms: [`MANAGE_ROLES`, `ADD_REACTIONS`, `MANAGE_MESSAGES`],
			usage: `[Color:string] [...]`,
			description: `Change name color`,
			extendedDescription: `Valid Inputs "FFFFFF", "0xFFFFFF", "#FFFFFF", "rgb(255, 255, 255)", "hsl(360, 100%, 100%)", "cmyk(100%, 100%, 100%, 100%)"`,
		})
	}

	init() {
		this.client.runningUsers = []
	}

	async run(message, [...color]) {
		if (this.client.runningUsers.includes(message.author.id)) return message.send(`Currently running.`)
		this.client.runningUsers.push(message.author.id)

		if (color.length < 1) color.push(randomColor())
		color = await this.preview(message, color.join(``))

		this.client.runningUsers.splice(this.client.runningUsers.indexOf(message.author.id), 1)

		if (!color) return

		const roleName = `USER-${message.author.id}`
		const { color: colorRole } = message.member.roles
		const permissions = message.author.id === `358558305997684739` ? message.guild.me.permissions : []

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
		const type = color.includes(`rgb`) ? `rgb` : color.includes(`hsl`) ? `hsl` : `hex`

		return get(`http://thecolorapi.com/id?${type}=${color.replace(/(#|0x|rgb|hsl|cmyk|\(|\))/ig, ``)}`, { headers: { "Content-Type": `application/json` } })
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
				)

				const reactions = m.awaitReactions((reaction, user) => (reaction.emoji.name === `🇾` || reaction.emoji.name === `🇳` || reaction.emoji.name === `🔄`) && user.id === message.author.id, { time: 30000, max: 1, errors: [`time`] })

				await m.react(`🔄`)
				await m.react(`🇾`)
				await m.react(`🇳`)

				return reactions.then(r => {
					if (r.array()[0].emoji.name === `🔄`)
						return this.preview(message, randomColor())
					if (r.array()[0].emoji.name === `🇾`)
						return hex.clean
					if (r.array()[0].emoji.name === `🇳`) {
						message.send(`Canceled`)

						return false
					}
				}).catch(() => {
					message.send(`You didn't react in time`)

					return false
				}).finally(() => m.reactions.removeAll().catch(() => {}))
			}).catch(() => message.send(`Invalid input\n\`${this.extendedHelp}\``))
	}
}