const { DATABASE_USER, DATABASE_PASSWORD, DEV } = process.env
const Sequelize = require(`sequelize`)
const { basename, resolve } = require(`path`)

module.exports = {
	Database: class Database extends Sequelize {
		constructor() {
			super(basename(resolve(`.`)).toLowerCase(), DATABASE_USER, DATABASE_PASSWORD, {
				host: DEV ? `192.168.1.4` : `localhost`,
				define: { freezeTableName: true },
				dialect: `postgres`,
				logging: false,
			})

			this.serverconfig = this.define(`guilds`, {
				id: {
					type: Sequelize.STRING,
					primaryKey: true,
					allowNull: false,
					unique: true,
				},
				prefix: {
					type: Sequelize.STRING,
					defaultValue: `${basename(resolve(`.`)).charAt(0)}!`,
					allowNull: false,
				},
			})
		}

		init() {
			this.sync()
		}
	},
}