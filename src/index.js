const Client = require(`./structures/Client`);
new Client({
	messageCacheMaxSize: 0,
	messageCacheLifetime: 1,
	messageSweepInterval: 1,
	disableEveryone: true,
	disabledEvents: [`TYPING_START`],
}).start();