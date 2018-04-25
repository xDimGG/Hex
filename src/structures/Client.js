const Database = require('./Database');
const GuildExtension = require('./Extensions/Guild');
const { AkairoClient } = require('discord-akairo');
const { Guild, Collection } = require('discord.js');

GuildExtension.extend(Guild);

module.exports = class extends AkairoClient {
	constructor(...options) {
		super(...options);
		this.db = new Database();
		this.runningUsers = {};
		this.bannedUsers = new Collection();
	}

	async login(token) {
		await this.db.sync();
		await super.login(token);
		console.log(this.user.tag);
	}
};