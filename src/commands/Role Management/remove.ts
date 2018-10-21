import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],
			description: 'Deletes the role that gives your name color, if you have one',
		});
	}

	public async exec(message: Message) {
		const colorRoles = message.member.roles.filter(r => r.name === `USER-${message.member.id}`);
		if (colorRoles.size === 0) return message.channel.send('You don\'t have a role');
		const colorRole = colorRoles.first()!;

		Promise.all(colorRoles.map(r => r.delete()));
		await message.channel.send(new MessageEmbed()
			.setDescription((await message.author.upvoted()) ? null : '[Please Upvote](https://discordbots.org/bot/361796552165031936/vote)')
			.setTitle(`**Removed ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://via.placeholder.com/150x50/${colorRole.hexColor.replace('#', '')}/${colorRole.hexColor.replace('#', '')}`)
			.setColor(colorRole.color));
	}
}