const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			usage: `<string:string>`,
			description: `Sends feedback to the bot creator`,
			extendedDescription: `Sends your message to the bots support server to be voted upon by everyone else.`
		})
	}

	run(message, [string]) {
		(process.env.DEV ? message.channel : this.client.channels.get(`368572194667888646`)).send(
			`\`${message.author.tag}\`\n` +
			`\`#${message.channel.name}\` in \`${message.guild.name}\`\n` +
			`\`\`\`\n${string}\n\`\`\``
		).then(async m => {
			await m.react(`👍`)
			await m.react(`👎`)
		})

		message.channel.send(`Thank you for your feedback`)
	}
}