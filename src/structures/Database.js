const { SequelizeProvider } = require(`discord-akairo`)
const { basename, resolve, join } = require(`path`)
const Sequelize = require(`sequelize`)

class Database extends Sequelize {
	constructor() {
		super({
			dialect: `sqlite`,
			logging: false,
			storage: join(__dirname, `../../../database.sqlite`),
			define: { freezeTableName: true },
		})
		this.model = this.define(basename(resolve(`.`)), {
			id: {
				type: Sequelize.STRING,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			settings: {
				type: Sequelize.JSON,
				allowNull: false,
				defaultValue: {},
			},
		})
		this.provider = new SequelizeProvider(this.model, { dataColumn: `settings` })
	}

	async auth() {
		await this.authenticate()
		await this.model.sync()
		await this.provider.init()
	}
}

module.exports = Database