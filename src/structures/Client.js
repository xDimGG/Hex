const { KlasaClient } = require(`klasa`)

Error.stackTraceLimit = Infinity

new class extends KlasaClient {
	constructor() {
		super({
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
		})
	}

	log(input, options = { code: `` }) {
		console.log(input)
		if (!process.env.DEV) this.channels.get(`361533828520476684`).send(input, options)
	}
}().login(process.env.TOKEN)