const Command = require('../../structures/Extensions/Command');
const { inspect } = require('util');

module.exports = class extends Command {
	constructor() {
		super({
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

		output = this.clean(output);

		message.channel.send([
			`${output instanceof Error ? '❌ Error' : '📤 Output'}:`,
			`${output.length > 2000 ? '' : `\`\`\`js\n${output}\n\`\`\``}`,
		], output.length > 2000 ? { files: [{ attachment: Buffer.from(output), name: 'output.txt' }] } : {});
	}

	clean(input) {
		for (const env in process.env)
			if (env.includes('TOKEN') || env.includes('POSTGRES') || env.includes('_API') || env.includes('WEBHOOK_')) input = String(input).replace(process.env[env], '[SECRET!]');

		return String(input)
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`);
	}
};