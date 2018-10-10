import { GuildModel } from '../../../typings';
import Client from '../Client';

export default (extensionClass: any) =>
	class extends extensionClass {
		public constructor(client: Client, data: any) {
			super(client, data);

			this.database = client.database;
			this.prefix = client.database.guilds.findOrCreate({ where: { id: this.id } }).then(([config]: any[]) => (config.dataValues as GuildModel).prefix).catch(() => 'h!');
		}

		public async get() {
			const [config] = await this.database.guilds.findOrCreate({ where: { id: this.id } });

			return config.dataValues;
		}

		public async set(data: object) {
			const config = await this.database.guilds.findById(this.id);

			return config.update(data).dataValues;
		}
	};