const { Command, Stopwatch } = require(`klasa`)
const { inspect } = require(`util`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			guarded: true,
			aliases: [`ev`],
			permLevel: 10,
			usageDelim: ``,
			usage: `<expression:str>`,
			description: msg => msg.language.get(`COMMAND_EVAL_DESCRIPTION`),
			extendedHelp: msg => msg.language.get(`COMMAND_EVAL_EXTENDEDHELP`),
		})
	}

	async run(message, [code]) {
		const { success, result, time, type } = await this.eval(message, code)
		const footer = this.client.methods.util.codeBlock(`ts`, type)
		const output = message.language.get(success ? `COMMAND_EVAL_OUTPUT` : `COMMAND_EVAL_ERROR`, time, this.client.methods.util.codeBlock(`js`, result), footer)
		const silent = `silent` in message.flags

		if (silent) return null

		// Handle too-long-messages
		if (output.length > 2000) {
			if (message.guild && message.channel.attachable)
				return message.channel.sendFile(Buffer.from(result), `output.txt`, message.language.get(`COMMAND_EVAL_SENDFILE`, time, footer))

			this.client.emit(`log`, result)

			return message.send(message.language.get(`COMMAND_EVAL_SENDCONSOLE`, time, footer))
		}

		// If it's a message that can be sent correctly, send it
		return message.send(output)
	}

	// Eval the input
	async eval(message, code) {
		const client = this.client // eslint-disable-line no-unused-vars
		const msg = message // eslint-disable-line no-unused-vars

		const stopwatch = new Stopwatch()
		let success
		let syncTime
		let asyncTime
		let result
		let thenable = false
		let type = ``
		try {
			if (message.flags.async) code = `(async () => {\n${code}\n})();`
			result = eval(code)
			syncTime = stopwatch.friendlyDuration
			if (this.client.methods.util.isThenable(result)) {
				thenable = true
				type += this.client.methods.util.getTypeName(result)
				stopwatch.restart()
				result = await result
				asyncTime = stopwatch.friendlyDuration
			}
			success = true
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.friendlyDuration
			if (thenable && !asyncTime) asyncTime = stopwatch.friendlyDuration
			result = error
			success = false
		}

		stopwatch.stop()
		type += thenable ? `<${this.client.methods.util.getDeepTypeName(result)}>` : this.client.methods.util.getDeepTypeName(result)
		if (success && typeof result !== `string`)
			result = inspect(result, {
				depth: message.flags.depth ? parseInt(message.flags.depth) || 0 : 0,
				showHidden: Boolean(message.flags.showHidden),
			})

		return { success, type, time: this.formatTime(syncTime, asyncTime), result: this.client.methods.util.clean(result) }
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`
	}
}