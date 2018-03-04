const { clean, haste } = require(`../../structures/Utils`)
const { Command } = require(`discord-akairo`)
const { exec } = require(`child_process`)
const { basename, sep } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Exec linux commands`,
			typing: true,
			ownerOnly: true,
			args: [
				{
					id: `code`,
					type: `string`,
					match: `text`,
					prompt: {
						start: `What would you like to exec?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`,
					},
				},
			],
		})
	}

	async exec(message, { code }) {
		let content = await this.addToContent(code, 1, 0)
		exec(code, { cwd: `../../../../` }, async (error, stdout, stderr) => {
			if (stderr || error)
				content += await this.addToContent(stderr || error.stack, 3, content.length)
			else
				content += await this.addToContent(stdout, 2, content.length)

			message.channel.send(content)
		})
	}

	async addToContent(input, type, length) {
		input = clean(input)

		return `${type === 1 ? `📥 Input` : type === 2 ? `📤 Output` : type === 3 ? `❌ Error` : `❔ Unknown`}\n${String(input).length + length < 2000 ? `\`\`\`\n${input}\n\`\`\`\n` : `${await haste(input)}`}`
	}
}