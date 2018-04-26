const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor() {
		super({
			channel: 'guild',
			clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES', 'EMBED_LINKS'],
			description: 'Deletes the role that gives your name color, if you have one.',
		});
	}

	exec(message) {
		const colorRole = message.member.roles.find('name', `USER-${message.member.id}`);

		if (!colorRole) return message.channel.send('You don\'t a hex role');

		colorRole.delete().then(() => {
			message.channel.send(new MessageEmbed()
				.setTitle(`**Removed ${colorRole.hexColor.toUpperCase()}**`)
				.setImage(`https://api.shaybox.com/color/${colorRole.hexColor.replace('#', '')}?width=150&height=50`)
				.setColor(colorRole.color)
			);
		}).catch(error => {
			message.channel.send(error, { code: 'js' });
		});
	}
};