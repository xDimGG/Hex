const Extension = require(`../Extension`)

module.exports = class extends Extension {
	async get() {
		const [config] = await this.client.db.guildConfig.findOrCreate({ where: { id: this.id } })

		return config.dataValues
	}

	async set(data) {
		const
			config = await this.client.db.guildConfig.findById(this.id),
			result = await config.update(data)

		return result.dataValues
	}
}