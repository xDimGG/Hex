const { AkairoClient, SequelizeProvider } = require(`discord-akairo`);
const Database = require(`./Database`);
const Guild = require(`../models/guilds`);

class Client extends AkairoClient {
	constructor() {
		super({
			ownerID: `358558305997684739`,
			serverID: `361532026354139156`,
			allowMention: true,
			emitters: { process },
			commandDirectory: `./src/commands/`,
			inhibitorDirectory: `./src/inhibitors/`,
			listenerDirectory: `./src/listeners/`,
			prefix: message => {
				const defaultPrefix = `${this.user.username.toLowerCase()[0]}!`;
				if (message.guild) return this.settings.get(message.guild.id, `prefix`, defaultPrefix);
				return defaultPrefix;
			}
		});
		this.settings = new SequelizeProvider(Guild, { dataColumn: `settings` });
	}

	async start() {
		await Database.authenticate();
		await this.settings.init();
		return super.login(process.env.Token).then(() => console.log(this.user.tag));
	}

	log(input) {
		console.log(input);
		if (!process.env.DEV) this.guilds.get(this.options.serverID).channels.find(`name`, `console`).send(input, { code: `js` });
	}
}

module.exports = Client;
