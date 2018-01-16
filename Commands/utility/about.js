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
			description: `Shows support message`,
			usage: ``,
			aliases: [`support`]
		})
	}

	run(client, message) {
		message.channel.send(new MessageEmbed()
			.setTitle(`Thank you for inviting me to your server!`)
			.setDescription(
				`**Note:**\n` +
				`\`You must set the color of every role to "Default" for me to work!\`\n` +
				`\`If you would like more support join my discord\` https://discord.io/shaybox`
			)
		)
		return true
	}
}

module.exports = Command
