const Commands = require(`../../../../__Global/Structures/Commands`)
const { MessageEmbed } = require(`discord.js`)

class Command extends Commands {
	constructor(client) {
		super(client, {
			enabled: true,
			show: true,
			owner: false,
			whitelist: false,
			cooldown: false,
			cooldownAmount: 1,
			cooldownTime: 3,
			limit: false,
			limitAmount: 3,
			limitTime: 86400,
			description: `Deletes color role`,
			usage: ``,
			aliases: []
		})
	}

	run(client, message) {
		const role = message.member.roles.find(`name`, `USER-${message.member.id}`)

		if (!role) {
			message.channel.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`You dont have one!`)
				.setColor(0xFF0000)
				.setFooter(client.botName)
				.setTimestamp()
			)
		}
		if (!message.guild.me.hasPermission([`MANAGE_ROLES`])) {
			message.channel.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(
					`Invalid permissions\n` +
					`\`\`\`\nMANAGE_ROLES\n\`\`\``
				)
				.setColor(0xFF0000)
				.setFooter(client.botName)
				.setTimestamp()
			)
			return
		}
		if (role.position > message.guild.me.highestRole.position) {
			message.channel.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(
					`Invalid permissions\n` +
					`Cannot delete role \`\`\`\n${role.name}\n\`\`\``
				)
				.setColor(0xFF0000)
				.setFooter(client.botName)
				.setTimestamp()
			)
			return
		}

		role.delete().then(role => {
			message.channel.send(new MessageEmbed()
				.setTitle(`✅ **Removed ${role.hexColor.toUpperCase().replace(`#`, ``)}**`)
				.setColor(role.color)
				.setFooter(client.botName)
				.setTimestamp()
			)
		}).catch(error => {
			message.channel.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`\`\`\`\n${error}\n\`\`\``)
				.setColor(0xFF0000)
				.setFooter(client.botName)
				.setTimestamp()
			)
		})
		return true
	}
}

module.exports = Command
