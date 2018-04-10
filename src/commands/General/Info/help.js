const { Command, util } = require(`klasa`)

module.exports = class This extends Command {
	constructor(...args) {
		super(...args, {
			aliases: [`commands`],
			description: msg => msg.language.get(`COMMAND_HELP_DESCRIPTION`),
			enabled: true,
			guarded: true,
			usage: `(Command:cmd)`,
		})

		this.createCustomResolver(`cmd`, (arg, possible, msg) => {
			if (!arg || arg === ``) return undefined

			return this.client.argResolver.cmd(arg, possible, msg)
		})
	}

	async run(message, [command]) {
		if (command) {
			const info = [
				`= Command = `,
				``,
			]

			if (command.usage) info.push(`Usage         :: ${command.usage.fullUsage(message)}`)
			if (command.description) info.push(`Description   :: ${util.isFunction(command.description) ? command.description(message) : command.description}`)
			if (command.extendedHelp) info.push(`Extended Help :: ${util.isFunction(command.extendedHelp) ? command.extendedHelp(message) : command.extendedHelp}`)

			return message.send(info.join(`\n`), { code: `asciidoc` })
		}
		const
			help = await this.buildHelp(message),
			categories = Object.keys(help),
			helpMessage = []
		for (let cat = 0; cat < categories.length; cat++) {
			helpMessage.push(`**${categories[cat]} Commands**:`, `\`\`\`asciidoc`)
			const subCategories = Object.keys(help[categories[cat]])
			for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`= ${subCategories[subCat]} =`, `${help[categories[cat]][subCategories[subCat]].join(`\n`)}\n`)
			helpMessage.push(`\`\`\``, `\u200b`)
		}

		return message.send(helpMessage, { split: { char: `\u200b` } })
	}

	async buildHelp(msg) {
		const
			help = {},
			commandNames = [...this.client.commands.keys()],
			longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0)

		await Promise.all(this.client.commands.map(command =>
			this.client.inhibitors.run(msg, command, true).then(() => {
				if (!help.hasOwnProperty(command.category)) help[command.category] = {}
				if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = []
				const description = typeof command.description === `function` ? command.description(msg) : command.description
				help[command.category][command.subCategory].push(`${command.name.padEnd(longest)} :: ${description}`)
			}).catch(() => {})
		))

		return help
	}
}