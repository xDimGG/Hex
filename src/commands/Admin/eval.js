const
	{ Command, Stopwatch, Type } = require(`klasa`),
	{ inspect } = require(`util`)

module.exports = class This extends Command {
	constructor(...args) {
		super(...args, {
			aliases: [`ev`],
			description: msg => msg.language.get(`COMMAND_EVAL_DESCRIPTION`),
			enabled: true,
			extendedHelp: msg => msg.language.get(`COMMAND_EVAL_EXTENDEDHELP`),
			guarded: true,
			permLevel: 10,
			usage: `<Code:string>`,
		})
	}

	async run(message, [code]) {
		const
			{ success, result, time, type } = await this.eval(message, code),
			footer = this.client.methods.util.codeBlock(`ts`, type),
			output = message.language.get(success ? `COMMAND_EVAL_OUTPUT` : `COMMAND_EVAL_ERROR`, time, this.client.methods.util.codeBlock(`js`, result), footer),
			silent = `silent` in message.flags

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
		const
			client = this.client, // eslint-disable-line no-unused-vars
			msg = message, // eslint-disable-line no-unused-vars
			stopwatch = new Stopwatch()
		let success, syncTime, asyncTime, result, thenable = false, type
		try {
			if (message.flags.async) code = `(async () => {\n${code}\n})();`
			result = eval(code)
			syncTime = stopwatch.friendlyDuration
			type = new Type(result)
			if (this.client.methods.util.isThenable(result)) {
				thenable = true
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
		if (success && typeof result !== `string`)
			result = inspect(result, {
				depth: message.flags.depth ? parseInt(message.flags.depth) || 0 : 0,
				showHidden: Boolean(message.flags.showHidden),
			})

		return { result: this.client.methods.util.clean(result), success, time: this.formatTime(syncTime, asyncTime), type }
	}

	formatTime(syncTime, asyncTime) {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`
	}
}