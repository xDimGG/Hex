const { Command } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
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
		if (!option || !value) return this.fallback(message, config)

		if (option.toLowerCase() === `prefix`)
			await message.guild.set({ prefix: value })
		else return this.fallback(message, config)

		message.channel.send(`Updated \`${option}\` to \`${value}\``)
	}

	async fallback(message, { prefix }) {
		return message.channel.send(
			`Prefix :: ${prefix}\n` +
			`\n` +
			`[ To set any of the above, "${await this.client.akairoOptions.prefix(message)}config (option) (value)" ]`
			, { code: `asciidoc` }
		)
	}
}