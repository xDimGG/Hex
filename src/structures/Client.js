const { AkairoClient } = require(`discord-akairo`)
const Database = require(`./Database`)
const { post } = require(`snekfetch`)
const { inspect } = require(`util`)

class Client extends AkairoClient {
	constructor(options) {
		super({
			ownerID: `358558305997684739`,
			allowMention: true,
			emitters: { process },
			commandDirectory: `./src/commands/`,
			inhibitorDirectory: `./src/inhibitors/`,
			listenerDirectory: `./src/listeners/`,
			prefix: message => {
				const defaultPrefix = `${this.user.username.toLowerCase()[0]}!`
				if (message.guild) return this.settings.get(`G-${message.guild.id}`, `prefix`, defaultPrefix)

				return defaultPrefix
			},
		}, options)
		this.database = new Database()
		this.settings = this.database.provider
		this.servers = { MAIN: `361532026354139156` }
	}

	async start() {
		await this.database.auth()

		return super.login(process.env.Token).then(() => console.log(this.user.tag))
	}

	log(input) {
		console.log(input)
		if (!process.env.DEV) this.guilds.get(this.servers.MAIN).find(`name`, `console`).send(input, { code: `js` })
	}

	warn(input) {
		console.warn(input)
		if (!process.env.DEV) this.guilds.get(this.servers.MAIN).find(`name`, `console`).send(input, { code: `js` })
	}

	error(input) {
		console.error(input)
		if (!process.env.DEV) this.guilds.get(this.servers.MAIN).find(`name`, `console`).send(input, { code: `js` })
	}

	updateActivity() {
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
			.replace(process.env.Token, SECRET)

		for (const env in process.env)
			if (env.includes(`_API`)) input = input.replace(process.env[env], SECRET)

		return input
	}
}

module.exports = Client