const
	{ Command } = require(`discord-akairo`),
	{ post } = require(`snekfetch`),
	{ basename } = require(`path`),
	{ inspect } = require(`util`)

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			args: [
				{
					id: `code`,
					match: `content`,
				},
			],
			clientPermissions: [`SEND_MESSAGES`],
			ownerOnly: true,
		})
	}

	async exec(message, { code }) {
		if (!code) return message.channel.send(`Please provide code to eval`)

		let output = String
		try {
			output = inspect(await eval(code), { compact: true, maxArrayLength: null, showHidden: true })
		} catch (error) {
			output = inspect(error)
		}

		output = this.client.clean(output)

		message.channel.send(
			`${output instanceof Error ? `❌ Error` : `📤 Output`}:\n` +
			`${output.length > 2000 ? `` : `\`\`\`js\n${output}\n\`\`\``}`,
			output.length > 2000 ? { files: [{ attachment: Buffer.from(output), name: `output.txt` }] } : {})
	}
}