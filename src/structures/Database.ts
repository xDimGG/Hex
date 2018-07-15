import * as Sequelize from 'sequelize';

export default class extends Sequelize {
	public guilds: Sequelize.Model<{}, {}>;
	public constructor(uri: string) {
		super(uri, {
			dialect: 'postgres',
			logging: false,
		});

		this.guilds = this.define('guilds', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING,
			},
			prefix: {
				allowNull: false,
				defaultValue: 'h!',
				type: Sequelize.STRING,
			},
			role: {
				allowNull: true,
				type: Sequelize.STRING,
			},
		});
	}
}