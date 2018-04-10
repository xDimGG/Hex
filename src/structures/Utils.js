const { post } = require(`snekfetch`)

module.exports = {
	clean(input) {
		for (const env in process.env)
			if (env.includes(`TOKEN`) || env.includes(`_API`)) input = String(input).replace(process.env[env], `[SECRET!]`)

		return String(input)
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
	},

	error(...input) {
		console.error(input instanceof Array ? input.join(` `) : input)
		if (!process.env.DEV) post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_ERROR}`, { data: { content: input instanceof Array ? input.join(` `) : input }, headers: { "Content-Type": `application/json` } }).end()
	},

	log(input) {
		console.log(input instanceof Array ? input.join(` `) : input)
		if (!process.env.DEV) post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_LOG}`, { data: { content: input instanceof Array ? input.join(` `) : input }, headers: { "Content-Type": `application/json` } }).end()
	},

	updateActivity(client) {
		if (!process.env.DEV && process.env.DBL_API)
			post(`https://discordbots.org/api/bots/${client.user.id}/stats`, { headers: { Authorization: process.env.DBL_API } })
				.send({ server_count: client.guilds.size })
				.end()
				.catch(() => {})

		return client.user.setActivity(`${client.guilds.size} ${client.guilds.size > 1 ? `Guilds` : `Guild`} | ${client.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`, { type: `WATCHING` })
	},
}