import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			runIn: ['text'],
			requiredPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Gives name color, if you have one.',
		});
	}

	async run(message: KlasaMessage) {
		const colorRole = message.member.roles.find(r => r.name === `USER-${message.member.id}`);

		if (!colorRole) return message.send('You don\'t a hex role');

		return message.send(new MessageEmbed()
			.setTitle(`**Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://via.placeholder.com/150x50/${colorRole.hexColor.replace('#', '')}/${colorRole.hexColor.replace('#', '')}`)
			.setColor(colorRole.color)
		);
	}
}
