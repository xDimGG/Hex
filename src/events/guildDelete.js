const { updateActivity } = require(`../structures/Utils`)
const { Event } = require(`klasa`)

module.exports = class This extends Event {
	run(guild) {
		if (guild.available && !this.client.configs.preserveConfigs) this.client.gateways.guilds.deleteEntry(guild.id).catch(() => {})

		updateActivity(this.client)
	}
}