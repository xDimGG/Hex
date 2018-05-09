const Client = require('./structures/Client');

new Client({
	allowMention: true,
	automateAliases: true,
	automateCategories: true,
	commandDirectory: './src/commands/',
	emitters: true,
	handleEdits: true,
	inhibitorDirectory: './src/inhibitors/',
	listenerDirectory: './src/listeners/',
	ownerID: '358558305997684739',
	prefix: m => m.guild ? m.guild.get().then(c => c.prefix).catch(() => 'h!') : 'h!',
}, {
	disableEveryone: true,
	disabledEvents: ['TYPING_START'],
	messageCacheLifetime: 60,
	messageCacheMaxSize: 50,
	messageSweepInterval: 60,
}).login(process.env.token);