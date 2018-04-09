const
	{ updateActivity } = require(`../structures/Utils`),
	{ Event } = require(`klasa`)

module.exports = class This extends Event {
	run(guild) {
		if (!guild.available) return
		if (this.client.configs.guildBlacklist.includes(guild.id)) {
			guild.leave()
			this.client.emit(`warn`, `Blacklisted guild detected: ${guild.name} [${guild.id}]`)
		}

		updateActivity(this.client)
	}
}