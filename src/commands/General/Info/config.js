const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			permLevel: 6,
			runIn: [`text`],
			usage: `(Key:key) (Value:value)`,
			description: msg => msg.language.get(`COMMAND_CONF_SERVER_DESCRIPTION`),
		})

		this
			.createCustomResolver(`key`, arg => {
				if (arg && ![`prefix`].includes(arg.toLowerCase())) throw `Available Options: **Prefix**` // eslint-disable-line no-throw-literal

				return arg ? arg.toLowerCase() : undefined
			})
			.createCustomResolver(`value`, (arg, _, __, params) => {
				if (params[0] && !arg) throw `Please provide a value to set` // eslint-disable-line no-throw-literal

				return arg ? arg.toLowerCase() : undefined
			})
	}

	async run(message, [key, value]) {
		const config = message.guild.configs.toJSON()
		if (!key) {
			const content = [
				`= Guild Settings =`,
				`Prefix :: ${config.prefix}`,
			]

			return message.send(content.join(`\n`), { code: `asciidoc` })
		}

		await message.guild.configs.update(key, value)
		message.send(`Updated ${key} from ${config[key]} to ${value}`)
	}
}