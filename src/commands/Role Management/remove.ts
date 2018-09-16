import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],
			description: 'Deletes the role that gives your name color, if you have one',
		});
	}

	public async exec(message: Message) {
		const colorRole = message.member.roles.find(r => r.name === `USER-${message.member.id}`);

		if (!colorRole) return message.channel.send('You don\'t have a role');

		await colorRole.delete()
			.then(() => message.channel.send(new MessageEmbed()
				.setTitle(`**Removed ${colorRole.hexColor.toUpperCase()}**`)
				.setImage(`https://via.placeholder.com/150x50/${colorRole.hexColor.replace('#', '')}/${colorRole.hexColor.replace('#', '')}`)
				.setColor(colorRole.color)
			));
	}
}