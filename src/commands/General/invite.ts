import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			description: 'Displays the bot invite link',
		});
	}

	async init() {
		if (this.client.application && !this.client.application.botPublic) this.permissionLevel = 10;
	}

	async run(message: KlasaMessage) {
		return message.send([
			`Bot: <https://bot.shaybox.com/${this.client.user.id}>`,
			'Server: <https://discord.shaybox.com>',
		]);
	}
}
