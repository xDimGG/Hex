const
	Logger = require(`./Logger`),
	Database = require(`./Database`),
	GuildExtension = require(`./Extensions/Guild`),
	{ DBL_API, DEV, TOKEN } = process.env,
	{ AkairoClient } = require(`discord-akairo`),
	{ Guild } = require(`discord.js`),
	{ post } = require(`snekfetch`)

// Deal with it, I want all console events sent to a webhook, even if it's ugly.
for (const log in Logger) { // eslint-disable-line guard-for-in
	process[log] = console[log]
	console[log] = Logger[log]
}

GuildExtension.extend(Guild)

new class extends AkairoClient {
	constructor() {
		super({
			allowMention: true,
			automateCategories: true,
			commandDirectory: `./src/commands/`,
			emitters: true,
			handleEdits: true,
			inhibitorDirectory: `./src/inhibitors/`,
			listenerDirectory: `./src/listeners/`,
			ownerID: `358558305997684739`,
			prefix: async m => m.guild ? (await m.guild.get()).prefix : `h!`,
		}, {
			disableEveryone: true,
			disabledEvents: [`TYPING_START`],
			messageCacheLifetime: 60,
			messageCacheMaxSize: 50,
			messageSweepInterval: 60,
		})
		this.db = new Database()
		this.runningUsers = []
	}

	async init() {
		await this.db.sync()
		await this.login(TOKEN)
		process.log(this.user.tag)
	}

	clean(input) {
		for (const env in process.env)
			if (env.includes(`TOKEN`) || env.includes(`POSTGRES`) || env.includes(`_API`) || env.includes(`WEBHOOK_`)) input = String(input).replace(process.env[env], `[SECRET!]`)

		return String(input)
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
	}

	updateActivity() {
		this.user.setActivity(`${this.guilds.size} ${this.guilds.size > 1 ? `Guilds` : `Guild`} | ${this.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`, { type: `WATCHING` })
		if (!DEV && DBL_API)
			post(`https://discordbots.org/api/bots/${this.user.id}/stats`, { data: { server_count: this.guilds.size }, headers: { Authorization: DBL_API } }).end()
	}
}().init()