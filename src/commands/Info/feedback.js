const	{ Command } = require('discord-akairo');
const	{ basename } = require('path');

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split('.')[0], {
			aliases: [basename(__filename).split('.')[0]],
			args: [
				{
					id: 'feedback',
					match: 'content',
				},
			],
			clientPermissions: ['SEND_MESSAGES'],
			description: 'Sends your message to the bots support server to be voted upon by everyone else.',
		});
	}

	exec(message, { feedback }) {
		if (!feedback) return message.channel.send('Please provide input');
		this.client.channels.get('368572194667888646').send(
			`\`${message.author.tag}\`\n` +
			`${message.channel.type === 'text' ? `\`#${message.channel.name}\` in \`${message.guild.name} (${message.guild.id})\`\n` : 'DMs / GroupDMs\n'}` +
			`\`\`\`\n${feedback}\n\`\`\``
		);

		message.channel.send('Thank you for your feedback');
	}
};