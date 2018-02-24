const { Command } = require(`discord-akairo`)
const { basename, sep } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			userPermissions: [`ADMINISTRATOR`],
			description: `Shows/Changes config settings`,
			typing: true,
			args: [
				{
					id: `option`,
					type: `string`,
				},
				{
					id: `value`,
					type: `string`,
				},
			],
		})
	}

	async exec(message, { option, value }) {
		const config = await message.guild.get()
		if (!option) return this.fallback(message, config)
		let oldValue = value

		if (option.toLowerCase() === `prefix`) {
			oldValue = config.prefix
			await message.guild.set({ prefix: value })
		} else return this.fallback(message, config)

		message.channel.send(`Updated \`${option}\` to \`${oldValue}\` from \`${value}\``)
	}

	fallback(message, config) {
		return message.channel.send(
			`Prefix :: ${config.prefix}\n` +
			`\n` +
			`[ To set any of the above, "${this.client.akairoOptions.prefix(message)}config (option) (value)" ]`
			, { code: `asciidoc` }
		)
	}
}