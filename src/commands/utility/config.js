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
		if (!option || !Object.keys(config).includes(option)) {
			const configNames = Object.keys(config).filter(k => k !== `createdAt` && k !== `updatedAt` && k !== `id`)
			const longest = configNames.reduce((long, str) => Math.max(long, str.length), 0)

			return message.channel.send(
				`= Options =\n` +
        `\n` +
        `${configNames.map(c => `${c}${` `.repeat(longest - c.length)} :: ${config[c]}`).sort().join(`\n`)}\n` +
				`\n` +
				`= To set option use "${this.client.akairoOptions.prefix(message)}config (option) (value)" =`,
				{ code: `asciidoc` }
			)
		}

		await message.guild.set({ [option]: value })
		message.channel.send(`Updated \`${option}\` from \`${config[option]}\` to \`${value}\``)
	}
}