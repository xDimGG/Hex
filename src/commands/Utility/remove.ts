import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			runIn: ['text'],
			requiredPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],
			description: 'Deletes the role that gives your name color, if you have one.'
		});
	}

	async run(message: KlasaMessage) {
		const colorRole = message.member.roles.find(r => r.name === `USER-${message.member.id}`);

		if (!colorRole) return message.send('You don\'t a hex role');

		return colorRole.delete()
			.then(async () => message.send(new MessageEmbed()
				.setTitle(`**Removed ${colorRole.hexColor.toUpperCase()}**`)
				.setImage(`https://api.shaybox.com/color/${colorRole.hexColor.replace('#', '')}?width=150&height=50`)
				.setColor(colorRole.color)
			));
	}
}
