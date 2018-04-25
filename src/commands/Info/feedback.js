const Command = require('../../structures/Command');

module.exports = class extends Command {
	constructor() {
		super({
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
		if (!feedback) return message.channel.send('**Missing Argument**: **Feedback**');

		this.client.channels.get('368572194667888646').send([
			`\`${message.author.tag}\``,
			`${message.channel.type === 'text' ? `\`#${message.channel.name}\` in \`${message.guild.name} (${message.guild.id})\`` : 'DMs / GroupDMs'}`,
			`\`\`\`\n${feedback}\n\`\`\``,
		]);

		message.channel.send('Thank you for your feedback');
	}
};