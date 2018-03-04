const { AkairoClient } = require(`discord-akairo`)
const { Database } = require(`./Database`)
const { Guild } = require(`discord.js`)

require(`./extensions/GuildExtension`).extend(Guild)

new class Client extends AkairoClient {
	constructor() {
		super({
			ownerID: `358558305997684739`,
			handleEdits: true,
			allowMention: true,
			automateCategories: true,
			emitters: { process },
			commandDirectory: `./src/commands/`,
			inhibitorDirectory: `./src/inhibitors/`,
			listenerDirectory: `./src/listeners/`,
			prefix: async message => {
				if (message.guild) return (await message.guild.get()).prefix

				return `${this.user.username.charAt(0)}!`
			},
		}, {
			messageCacheMaxSize: 0,
			messageCacheLifetime: 1,
			messageSweepInterval: 1,
			disableEveryone: true,
			disabledEvents: [`TYPING_START`],
		})
		this.db = new Database()
	}

	start() {
		this.db.init()

		return this.login(process.env.TOKEN).then(() => console.log(this.user.tag))
	}

	log(input, ...options) {
		console.log(input)
		if (!process.env.DEV) this.channels.get(`361533828520476684`).send(input, ...options)
	}
}().start()