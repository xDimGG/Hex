const Database = require('./Database');
const GuildExtension = require('./Extensions/Guild');
const { AkairoClient } = require('discord-akairo');
const { Guild, Collection } = require('discord.js');

GuildExtension.extend(Guild);

new class extends AkairoClient {
	constructor() {
		super({
			allowMention: true,
			automateAliases: true,
			automateCategories: true,
			commandDirectory: './src/commands/',
			emitters: true,
			handleEdits: true,
			inhibitorDirectory: './src/inhibitors/',
			listenerDirectory: './src/listeners/',
			ownerID: '358558305997684739',
			prefix: m => m.guild ? m.guild.get().then(c => c.prefix) : 'h!',
		}, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			messageCacheLifetime: 60,
			messageCacheMaxSize: 50,
			messageSweepInterval: 60,
		});
		this.db = new Database();
		this.runningUsers = {};
		this.bannedUsers = new Collection();
	}

	async init() {
		await this.db.sync();
		await this.login(process.env.TOKEN);
		console.log(this.user.tag);
	}
}().init();