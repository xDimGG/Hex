const Sequelize = require(`sequelize`)

module.exports = class extends Sequelize {
	constructor() {
		super(process.env.POSTGRES, {
			dialect: `postgres`,
			logging: false,
		})
		this.guildConfig = this.define(`guilds`, {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING,
				unique: true,
			},
			prefix: {
				allowNull: false,
				defaultValue: `h!`,
				type: Sequelize.STRING,
			},
		})
	}
}