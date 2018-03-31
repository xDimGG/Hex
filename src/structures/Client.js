const { KlasaClient } = require(`klasa`)

Error.stackTraceLimit = Infinity

new class extends KlasaClient {
	constructor() {
		super({
			quotedStringSupport: true,
			cmdDeleting: true,
			cmdEditing: true,
			cmdPrompt: true,
			clientBaseDir: `./src/`,
			prefix: `h!`,
			readyMessage: client => client.user.tag,
			commandMessageLifetime: 300,
			messageCacheMaxSize: 50,
			messageCacheLifetime: 60,
			messageSweepInterval: 60,
			disableEveryone: true,
			disabledEvents: [`TYPING_START`],
			console: { timestamps: false },
			pieceDefaults: { commands: { enabled: false, usageDelim: ` ` } },
		})
	}

	log(input, options = { code: `` }) {
		console.log(input)
		if (!process.env.DEV) this.channels.get(`361533828520476684`).send(input, options)
	}
}().login(process.env.TOKEN)