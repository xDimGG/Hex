import { Message, MessageEmbed } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Shows role color, if you have one',
		});
	}

	public async exec(message: Message) {
		const colorRole = message.member.roles.find(r => r.name === `USER-${message.member.id}`);

		if (!colorRole) return message.channel.send('You don\'t have a role');

		const embed = new MessageEmbed()
			.setTitle(`**Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://via.placeholder.com/150x50/${colorRole.hexColor.replace('#', '')}/${colorRole.hexColor.replace('#', '')}`)
			.setColor(colorRole.color);
		if (!await message.author.upvoted()) embed.setDescription('[I would appreciate if you upvoted](https://discordbots.org/bot/361796552165031936/vote)');
		await message.channel.send(embed);
	}
}