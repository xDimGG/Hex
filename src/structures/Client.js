const { AkairoClient } = require(`discord-akairo`)
const { Database } = require(`./Database`)
const { Guild } = require(`discord.js`)

require(`./extensions/GuildExtension`).extend(Guild)

module.exports = class Client extends AkairoClient {
	constructor(options) {
		super({
			ownerID: `358558305997684739`,
			allowMention: true,
			emitters: { process },
			commandDirectory: `./src/commands/`,
			inhibitorDirectory: `./src/inhibitors/`,
			listenerDirectory: `./src/listeners/`,
			prefix: async message => {
				let prefix = `${this.user.username.charAt(0)}!`
				if (message.guild) prefix = (await message.guild.get()).prefix

				return prefix
			},
		}, options)
		this.db = new Database()
	}

	start() {
		this.db.init()

		return this.login(process.env.TOKEN).then(() => console.log(this.user.tag))
	}

	log(input, ...options) {
		console.log(input)
		if (!process.env.DEV) this.guilds.get(`361532026354139156`).channels.find(`name`, `console`).send(input, ...options)
	}
}