const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: [`text`],
			permLevel: 6,
			usage: `(Key:key) (Value:value)`,
			description: msg => msg.language.get(`COMMAND_CONF_SERVER_DESCRIPTION`),
		})

		this
			.createCustomResolver(`key`, arg => {
				if (arg && ![`prefix`, `mode`, `characters`].includes(arg.toLowerCase())) throw `**Prefix**, **Mode**, or **Characters**` // eslint-disable-line no-throw-literal

				return arg.toLowerCase()
			})
			.createCustomResolver(`value`, (arg, _, __, params) => {
				if (params[0] && !arg) throw `Please provide a value to set` // eslint-disable-line no-throw-literal

				return arg.toLowerCase()
			})
	}

	async run(message, [key, value]) {
		const config = message.guild.configs.toJSON()
		if (!key) {
			const content = [
				`= Guild Settings =`,
				`prefix     :: ${config.prefix}`,
			]
			message.send(content.join(`\n`), { code: `asciidoc` })
		}

		await message.guild.configs.update(key, value)
		message.send(`Updated ${key} from ${config[key]} to ${value}`)
	}
}