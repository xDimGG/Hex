const { AkairoClient } = require(`discord-akairo`)
const { GuildExtension } = require(`./models/Guild`)
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
		if (!process.env.DEV) this.guilds.get(`361532026354139156`).find(`name`, `console`).send(input, { code: `js` })
	}

	warn(input) {
		console.warn(input)
		if (!process.env.DEV) this.guilds.get(`361532026354139156`).find(`name`, `console`).send(input, { code: `js` })
	}

	error(input) {
		console.error(input)
		if (!process.env.DEV) this.guilds.get(`361532026354139156`).find(`name`, `console`).send(input, { code: `js` })
	}

	updateActivity() {
		if (!process.env.DEV)	{
			post(`https://discordbots.org/api/bots/${this.user.id}/stats`, { headers: { Authorization: process.env.DBL_API } }).end().send({ server_count: this.guilds.size })
			post(`https://bots.discord.pw/api/bots/${this.user.id}/stats`, { headers: { Authorization: process.env.DBO_API } }).end().send({ server_count: this.guilds.size })
		}

		return this.user.setActivity(`${this.guilds.size} ${this.guilds.size > 1 ? `Guilds` : `Guild`}`)
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
		if (typeof input !== `string`) input = inspect(input, { depth: 0 })
		input = input
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(process.env.TOKEN, SECRET)

		for (const env in process.env)
			if (env.includes(`_API`) || env.includes(`DATABASE`)) input = input.replace(process.env[env], SECRET)

		return input
	}
}