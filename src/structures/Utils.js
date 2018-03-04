const { post } = require(`snekfetch`)

module.exports = {
	haste(input) {
		return post(`https://www.hastebin.com/documents`)
			.send(String(input))
			.end()
			.then(({ body }) => `https://www.hastebin.com/${body.key}`)
			.catch(error => `\`\`\`js\n${error}\n\`\`\`\n`)
	},

	clean(input) {
		const SECRET = `[SECRET!]`

		for (const env in process.env)
			if (env.includes(`TOKEN`) || env.includes(`_API`) || env.includes(`DATABASE`)) input = String(input).replace(process.env[env], SECRET)

		return String(input)
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
	},

	updateActivity() {
		if (!process.env.DEV && process.env.DBL_API)
			post(`https://discordbots.org/api/bots/${this.user.id}/stats`, { headers: { Authorization: process.env.DBL_API } })
				.send({ server_count: this.guilds.size })
				.end()
				.catch(() => null)

		return this.user.setActivity(`${this.guilds.size} ${this.guilds.size > 1 ? `Guilds` : `Guild`} | ${this.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`)
	},
}