const { AkairoClient } = require(`discord-akairo`)
const { Database } = require(`./Database`)
const { Guild } = require(`discord.js`)
const { post } = require(`snekfetch`)

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

	updateActivity() {
		if (!process.env.DEV && process.env.DBL_API)
			post(`https://discordbots.org/api/bots/${this.user.id}/stats`, { headers: { Authorization: process.env.DBL_API } })
				.send({ server_count: this.guilds.size })
				.end()
				.catch(() => null)

		return this.user.setActivity(`${this.guilds.size} ${this.guilds.size > 1 ? `Guilds` : `Guild`} | ${this.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`)
	}

	haste(input) {
		return post(`https://www.hastebin.com/documents`)
			.send(String(input))
			.end()
			.then(({ body }) => `https://www.hastebin.com/${body.key}`)
			.catch(error => `\`\`\`js\n${error}\n\`\`\`\n`)
	}

	clean(input) {
		const SECRET = `[SECRET!]`

		for (const env in process.env)
			if (env.includes(`TOKEN`) || env.includes(`_API`) || env.includes(`DATABASE`)) input = String(input).replace(process.env[env], SECRET)

		return String(input)
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
	}
}