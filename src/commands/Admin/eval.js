const	{ Command } = require('discord-akairo');
const	{ basename } = require('path');
const	{ inspect } = require('util');

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split('.')[0], {
			aliases: [basename(__filename).split('.')[0]],
			args: [
				{
					id: 'code',
					match: 'content',
				},
			],
			clientPermissions: ['SEND_MESSAGES'],
			ownerOnly: true,
		});
	}

	async exec(message, { code }) {
		if (!code) return message.channel.send('Please provide code to eval');

		let output;
		try {
			const evaled = eval(code);
			output = inspect(evaled instanceof Promise ? await evaled : evaled);
		} catch (error) {
			output = inspect(error);
		}

		output = this.client.clean(output);

		message.channel.send(
			`${output instanceof Error ? '❌ Error' : '📤 Output'}:\n` +
			`${output.length > 2000 ? '' : `\`\`\`js\n${output}\n\`\`\``}`,
			output.length > 2000 ? { files: [{ attachment: Buffer.from(output), name: 'output.txt' }] } : {}
		);
	}
};