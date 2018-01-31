const { Command } = require(`discord-akairo`)
const { basename, sep } = require(`path`)
const { inspect } = require(`util`)

class This extends Command {
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
		let content = await this.addToContent(code, `Input`, 0)
		try {
			let evaled = eval(code)

			if (evaled instanceof Promise) evaled = await evaled
			if (evaled instanceof Object || evaled instanceof Function) evaled = inspect(evaled, { showHidden: true, showProxy: true, depth: 1 })

			content += await this.addToContent(evaled, `Output`, content.length)
		} catch (error) {
			content += await this.addToContent(error, `Error`, content.length)
		}
		message.channel.send(content)
	}

	async addToContent(input, type, length) {
		return `${type === `Input` ? `📥` : type === `Output` ? `📤` : `❌`} ${type}\n${String(input).length < 1024 - length ? `\`\`\`js\n${this.client.clean(input)}\n\`\`\`\n` : `${await this.client.haste(this.client.clean(input))}.js`}`
	}
}

module.exports = This