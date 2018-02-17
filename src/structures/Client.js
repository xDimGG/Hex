const { GuildExtension } = require(`./models/Guild`)
const { AkairoClient } = require(`discord-akairo`)
const { sync } = require(`promise-synchronizer`)
const { Database } = require(`./Database`)
const { Guild } = require(`discord.js`)
const { post } = require(`snekfetch`)
const { inspect } = require(`util`)

GuildExtension.extend(Guild)

module.exports = class Client extends AkairoClient {
	constructor(options) {
		super({
			ownerID: `358558305997684739`,
			allowMention: true,
			emitters: { process },
			commandDirectory: `./src/commands/`,
			inhibitorDirectory: `./src/inhibitors/`,
			listenerDirectory: `./src/listeners/`,
			prefix: message => {
				let prefix = `${this.user.username.charAt(0)}!`
				if (message.guild)
					try {
						prefix = sync(message.guild.get()).prefix
					} catch (error) {
						console.error(error)
					}

				return prefix
			},
		}, options)
		this.db = new Database()
	}

	async start() {
		this.db.init()

		return this.login(process.env.TOKEN).then(() => console.log(this.user.tag))
	}

	log(input) {
		console.log(input)
		if (!process.env.DEV) this.guilds.get(`361532026354139156`).channels.find(`name`, `console`).send(input)
	}

	updateActivity() {
		if (!process.env.DEV)	{
			if (process.env.DBL_API) post(`https://discordbots.org/api/bots/${this.user.id}/stats`, { headers: { Authorization: process.env.DBL_API } }).send({ server_count: this.guilds.size }).end()
			if (process.env.DBO_API) post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`, { headers: { Authorization: process.env.DBO_API } }).send({ server_count: this.guilds.size }).end()
		}

		return this.user.setActivity(`${this.guilds.size} ${this.guilds.size > 1 ? `Guilds` : `Guild`} | ${this.client.guilds.reduce((a, b) => a + b.memberCount, 0)}`)
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
		if (typeof input !== `string`) input = inspect(input, { showHidden: true, showProxy: true, depth: null })
		input = input
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)

		process.env.filter(e => e.includes(`_API`) || e.includes(`DATABASE`) || e.includes(`TOKEN`)).forEach(e => input = input.replace(process.env[e], SECRET))

		return input
	}
}