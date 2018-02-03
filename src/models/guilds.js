const Database = require(`../structures/Database`)
const Sequelize = require(`sequelize`)
const { basename } = require(`path`)

const Guild = Database.db.define(basename(__filename).split(`.`)[0], {
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

module.exports = Guild