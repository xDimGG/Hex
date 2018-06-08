import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			aliases: ['servers'],
			permissionLevel: 10,
			description: 'Show list of all guilds bot is in',
		});
	}

	async run(message: KlasaMessage) {
		const longestCount = this.client.guilds.map(g => g.memberCount.toString().length).reduce((long, str) => Math.max(long, str), 0);
		const longestID = this.client.guilds.map(g => g.id.toString().length).reduce((long, str) => Math.max(long, str), 0);

		return message.send(this.client.guilds.sort((a, b) => b.memberCount - a.memberCount).map(g => `${g.memberCount}${' '.repeat(longestCount - g.memberCount.toString().length)} | ${g.id}${' '.repeat(longestID - g.id.toString().length)} | ${g.name}`).join('\n'), { code: true, split: true });
	}
}