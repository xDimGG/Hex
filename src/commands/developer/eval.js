const { Command } = require(`discord-akairo`)
const { basename, sep, resolve } = require(`path`)
const { inspect } = require(`util`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Eval javascript code`,
			typing: true,
			ownerOnly: true,
			args: [
				{
					id: `code`,
					type: `string`,
					match: `text`,
					prompt: {
						start: `What would you like to eval?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`,
					},
				},
			],
		})
	}

	async exec(message, { code }) {
		const { client } = this // eslint-disable-line no-unused-vars
		const msg = message // eslint-disable-line no-unused-vars

		let content = await this.addToContent(code, 1, 0)
		try {
			let evaled = eval(code)

			if (evaled instanceof Promise) evaled = await evaled

			content += await this.addToContent(inspect(evaled, { showHidden: true, showProxy: true, depth: null }), 2, content.length)
		} catch (error) {
			content += await this.addToContent(error.stack, 3, content.length)
		}
		message.channel.send(content)
	}

	async addToContent(input, type, length) {
		input = this.client.clean(input)

		return `${type === 1 ? `📥 Input` : type === 2 ? `📤 Output` : type === 3 ? `❌ Error` : `❔ Unknown`}\n${String(input).length + length < 2000 ? `\`\`\`js\n${input}\n\`\`\`\n` : `${await this.client.haste(input)}.js`}`
	}
}