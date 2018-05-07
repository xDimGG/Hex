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
			description: 'Sends your message to the bots support server.',
		});
	}

	exec(message, { feedback }) {
		if (!feedback) return message.channel.send('**Missing Argument**: **Feedback**');

		this.client.channels.get(process.env.DEV ? '397859799905075200' : '368572194667888646').send([
			`User: \`${message.author.tag}\` \`(${message.author.id})\``,
			`Channel: \`${message.channel.name}\` \`(${message.channel.id})\``,
			`Guild: \`${message.guild.name}\` \`(${message.guild.id})\``,
			`Message: \`\`\`\n${feedback}\n\`\`\``,
		]);

		message.channel.send([
			'Thank you for your feedback!',
			'Consider joining my support server <https://discord.shaybox.com/>',
		]);
	}
};