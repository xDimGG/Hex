const { Command } = require(`discord-akairo`)
const { MessageEmbed } = require(`discord.js`)
const { basename } = require(`path`)
const randomColor = require(`randomcolor`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0], `check`],
			clientPermissions: [`SEND_MESSAGES`, `MANAGE_ROLES`],
			description: `Changes name color`,
			typing: true,
			cooldown: 10000,
			ratelimit: 1,
			channel: `guild`,
			args: [
				{
					id: `color`,
					type: `color`,
					default: () => randomColor(),
				},
			],
		})
	}

	exec(message, { color }) {
		const roleName = `USER-${message.author.id}`
		const { color: colorRole } = message.member.roles

		if (!colorRole)
			message.guild.roles.create({
				data: {
					name: roleName,
					color,
					permissions: [],
				},
			}).then(role => {
				message.member.roles.add(role).catch(error => this.error(message, error))

				return this.success(message, color)
			}).catch(error => this.error(message, error))
		else if (colorRole.name === roleName)
			colorRole.setColor(color)
				.then(() => this.success(message, color))
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