const { Command } = require(`discord-akairo`)
const { basename, sep } = require(`path`)

module.exports = class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Shows bots guilds`,
			typing: true,
			ownerOnly: true,
		})
	}

	exec(message) {
		const longestCount = this.client.guilds.map(g => g.memberCount.toString().length).reduce((long, str) => Math.max(long, str), 0)
		const longestID = this.client.guilds.map(g => g.id.toString().length).reduce((long, str) => Math.max(long, str), 0)
		message.channel.send(this.client.guilds.sort((a, b) => b.memberCount - a.memberCount).map(g => `${g.memberCount}${` `.repeat(longestCount - g.memberCount.toString().length)} | ${g.id}${` `.repeat(longestID - g.id.toString().length)} | ${g.name}`).join(`\n`), { code: true, split: true })
	}
}