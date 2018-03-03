const Extension = require(`./Extension`)

module.exports = class GuildExtension extends Extension {
	async get() {
		const [config] = await this.client.db.guildConfig.findOrCreate({ where: { id: this.id } })

		return config.dataValues
	}

	async set(data) {
		const config = await this.client.db.guildConfig.findById(this.id)
		const result = await config.update(data)

		return result.dataValues
	}
}