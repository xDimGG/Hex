const { Command } = require(`discord-akairo`)
const { exec } = require(`child_process`)
const { basename, sep } = require(`path`)

class This extends Command {
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
		let content = await this.addToContent(code, `Input`, 0)
		exec(code, { cwd: `../../../../` }, async (error, stdout, stderr) => {
			if (stderr)
				content += await this.addToContent(stderr, `Error`, content.length)
			else if (error)
				content += await this.addToContent(error, `Error`, content.length)
			else
				content += await this.addToContent(stdout, `Output`, content.length)

			message.channel.send(content)
		})
	}

	async addToContent(input, type, length) {
		return `${type === `Input` ? `📥` : type === `Output` ? `📤` : `❌`} ${type}\n${String(input).length < 1024 - length ? `\`\`\`js\n${this.client.clean(input)}\n\`\`\`\n` : `${await this.client.haste(this.client.clean(input))}.js`}`
	}
}

module.exports = This