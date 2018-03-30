const { Command } = require(`klasa`)

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			enabled: true,
			permLevel: 9,
			aliases: [`guilds`],
			description: `All guilds the bot is in`,
		})
	}

	run(message) {
		const longestCount = this.client.guilds.map(g => g.memberCount.toString().length).reduce((long, str) => Math.max(long, str), 0)
		const longestID = this.client.guilds.map(g => g.id.toString().length).reduce((long, str) => Math.max(long, str), 0)
		message.send(this.client.guilds.sort((a, b) => b.memberCount - a.memberCount).map(g => `${g.memberCount}${` `.repeat(longestCount - g.memberCount.toString().length)} | ${g.id}${` `.repeat(longestID - g.id.toString().length)} | ${g.name}`).join(`\n`), { code: true, split: true })
	}
}