import { GuildModel } from '../../../typings';
import Client from '../Client';

export default (guild: any) =>
	class extends guild {
		public constructor(client: Client, data: any) {
			super(client, data);

			this.database = client.database;
			this.prefix = client.database.guilds.findOrCreate({ where: { id: this.id } }).then(([config]: any[]) => (config.dataValues as GuildModel).prefix);
		}

		public async getConfig() {
			const [config] = await this.database.guilds.findOrCreate({ where: { id: this.id } });

			return config.dataValues;
		}

		public async setConfig(data: object) {
			const config = await this.database.guilds.findById(this.id);

			return config.update(data).dataValues;
		}
	};