const { KlasaClient } = require(`klasa`)

new KlasaClient({
	clientBaseDir: `./src/`,
	cmdDeleting: true,
	cmdEditing: true,
	cmdPrompt: true,
	commandMessageLifetime: 300,
	console: { timestamps: false },
	disableEveryone: true,
	disabledEvents: [`TYPING_START`],
	messageCacheLifetime: 60,
	messageCacheMaxSize: 50,
	messageSweepInterval: 60,
	pieceDefaults: { commands: { enabled: false } },
	prefix: `h!`,
	quotedStringSupport: true,
	readyMessage: client => client.user.tag,
}).login(process.env.TOKEN)