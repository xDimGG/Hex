const Commands = require(`../../../../__Global/Structures/Commands`)
const { MessageEmbed } = require(`discord.js`)
const randomColor = require(`randomcolor`)

class Command extends Commands {
	constructor(client) {
		super(client, {
			enabled: true,
			show: true,
			owner: false,
			whitelist: false,
			cooldown: true,
			cooldownAmount: 10,
			cooldownTime: 30,
			limit: true,
			limitAmount: 30,
			limitTime: 86400,
			description: `Changes the color role's color`,
			usage: `[Hex Value or RANDOM]`,
			aliases: [`hex`, `color`, `colour`]
		})
		this.regex = /^(|#|0x)[0-9A-F]+$/i
	}

	run(client, message, args) {
		if (args.length < 1) return client.missingArgs(message, this)
		if (args[0].toLowerCase().includes(`random`)) args[0] = randomColor()
		if (!this.regex.test(args[0])) {
			return this.error(client, message,
				`Invalid hex value\n` +
				`Please input a value, "#000000", "0x000000", "000000", or "RANDOM"`
			)
		}
		if (!message.guild.me.hasPermission([`MANAGE_ROLES`])) {
			return this.error(client, message,
				`Missing permissions\n` +
				`"MANAGE_ROLES"`
			)
		}

		const roleName = `USER-${message.author.id}`
		const roleColor = parseInt(args[0].match(this.regex)[0].replace(`#`, ``).replace(`0x`, ``), 16)
		const { colorRole } = message.member

		if (!colorRole) {
			message.guild.roles.create({
				name: roleName,
				color: roleColor,
				permissions: []
			}).then(role => {
				message.member.addRole(role).catch(error => this.error(client, message, error))
				return this.success(client, message, roleColor)
			}).catch(error => this.error(client, message, error))
		} else if (colorRole.position > message.guild.me.highestRole.position) {
			return this.error(client, message,
				`Invalid permissions\n` +
				`Cannot edit role "${colorRole.name}"\n` +
				`Please move the role below Hex's role.`
			)
		} else if (colorRole.name === roleName) {
			message.member.colorRole.setColor(roleColor)
				.then(() => this.success(client, message, roleColor))
				.catch(error => this.error(client, message, error))
		} else if (colorRole.name !== roleName) {
			return this.error(client, message,
				`The role ${colorRole.name} is not set to DEFAULT\n` +
				`Please change the color of that role and try again.`
			)
		}
		return true
	}

	success(client, message, roleColor) {
		message.channel.send(new MessageEmbed()
			.setTitle(`✅ **Changed to #${roleColor}**`)
			.setColor(roleColor)
			.setFooter(client.botName)
			.setTimestamp()
		).catch(() => message.react(`✅`).catch(() => null))
	}

	error(client, message, error) {
		message.channel.send(new MessageEmbed()
			.setTitle(`❌ **ERROR**`)
			.setDescription(`\`\`\`js\n${error}\n\`\`\``)
			.setColor(0xFF0000)
			.setFooter(client.botName)
			.setTimestamp()
		).catch(() => message.react(`❌`).catch(() => null))
	}
}

module.exports = Command
