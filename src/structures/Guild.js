const Extension = require(`./Extension`)

module.exports = {
	GuildExtension: class GuildExtension extends Extension {
		async get() {
			const [config] = await this.client.db.serverconfig.findOrCreate({ where: { id: this.id } })

			return config.dataValues
		}

		async set(data) {
			const config = await this.client.db.serverconfig.findById(this.id)
			const result = await config.update(data)

			return result.dataValues
		}
	},
}