const { KlasaClient } = require(`klasa`)

new class extends KlasaClient {
	constructor() {
		super({
			quotedStringSupport: true,
			cmdDeleting: true,
			cmdEditing: true,
			cmdPrompt: true,
			typing: true,
			commandMessageLifetime: 300,
			ownerID: `358558305997684739`,
			clientBaseDir: `./src/`,
			prefix: `h!`,
			readyMessage: client => client.user.tag,
			console: { timestamps: false },
			clientOptions: {
				messageCacheMaxSize: -1,
				messageCacheLifetime: 60,
				messageSweepInterval: 1,
				disableEveryone: true,
				disabledEvents: [`TYPING_START`],
			},
		})
	}

	log(input, ...options) {
		console.log(input)
		if (!process.env.DEV) this.channels.get(`361533828520476684`).send(input, ...options)
	}
}().login(process.env.TOKEN)