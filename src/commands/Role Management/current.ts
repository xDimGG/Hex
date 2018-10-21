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
		const colorRole = message.member.roles.color;
		if (!colorRole) return message.channel.send('You don\'t have a role');
		if (colorRole.name !== `USER-${message.member.id}`) return message.channel.send('Your color role is not from Hex');

		await message.channel.send(new MessageEmbed()
			.setDescription((await message.author.upvoted()) ? null : '[Please Upvote](https://discordbots.org/bot/361796552165031936/vote)')
			.setTitle(`**Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://via.placeholder.com/150x50/${colorRole.hexColor.replace('#', '')}/${colorRole.hexColor.replace('#', '')}`)
			.setColor(colorRole.color));
	}
}