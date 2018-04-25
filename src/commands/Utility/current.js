const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor() {
		super({
			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Gives name color, if you have one.',
		});
	}

	exec(message) {
		const colorRole = message.member.roles.find('name', `USER-${message.member.id}`);

		if (!colorRole) return message.channel.send('You don\'t a hex role');

		message.channel.send(new MessageEmbed()
			.setTitle(`**Current value ${colorRole.hexColor.toUpperCase()}**`)
			.setImage(`https://api.shaybox.com/color/${colorRole.hexColor.replace('#', '')}?width=150&height=50`)
			.setColor(colorRole.color)
		);
	}
};