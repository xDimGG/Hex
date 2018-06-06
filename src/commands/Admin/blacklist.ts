import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			permissionLevel: 10,
			description: (message) => message.language.get('COMMAND_BLACKLIST_DESCRIPTION'),
			usage: '<User|Guild> <ID:str>',
			usageDelim: ' ',
		});
	}

	async run(message: KlasaMessage, [type, id]: string[]) {
		if (!this.client.configs) return message;

		if (type.toLowerCase() === 'user') await this.client.configs.update(`userBlacklist`, id, message.guild);
		if (type.toLowerCase() === 'guild') await this.client.configs.update(`guildBlacklist`, id, message.guild);

		return message.send(`Added ${id} to the ${type.toLowerCase()} blacklist`);
	}
}
