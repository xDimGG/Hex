const Database = require('./Database');
const GuildExtension = require('./Extensions/Guild');
const { AkairoClient } = require('discord-akairo');
const { Guild, Collection } = require('discord.js');

GuildExtension.extend(Guild);

module.exports = class extends AkairoClient {
	constructor(...options) {
		super(...options);
		this.db = new Database();
		this.bannedUsers = new Collection();
		this.runningUsers = {};
	}

	async login(token) {
		await this.db.sync();
		await super.login(token);

		this.bannedUsers = await this.guilds.get('361532026354139156').fetchBans();
	}
};