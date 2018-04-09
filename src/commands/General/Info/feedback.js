const { Command } = require(`klasa`)

module.exports = class This extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			usage: `<Feedback:string>`,
			description: `Sends feedback to the bot creator`,
			extendedDescription: `Sends your message to the bots support server to be voted upon by everyone else.`,
		})
	}

	run(message, [feedback]) {
		(process.env.DEV ? message.channel : this.client.channels.get(`368572194667888646`)).send(
			`\`${message.author.tag}\`\n` +
			`${message.channel.type === `text` ? `\`#${message.channel.name}\` in \`${message.guild.name}\`\n` : `DMs / GroupDMs\n`}` +
			`\`\`\`\n${feedback}\n\`\`\``
		).then(async m => {
			await m.react(`👍`)
			await m.react(`👎`)
		})

		message.send(`Thank you for your feedback`)
	}
}