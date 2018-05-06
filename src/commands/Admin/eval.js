const Command = require('../../structures/Command');
const { inspect } = require('util');

module.exports = class extends Command {
	constructor() {
		super({
			args: [
				{
					description: 'Code to eval',
					id: 'code',
					match: 'content',
				},
			],
			clientPermissions: ['SEND_MESSAGES'],
			ownerOnly: true,
		});
	}

	async exec(message, { code }) {
		if (!code) return message.channel.send('**Missing Argument**: **Code**');

		let output;
		try {
			const evaled = eval(code);
			output = evaled instanceof Promise ? await evaled : evaled;
		} catch (error) {
			output = error.stack;
		}

		output = this.clean(output);

		message.channel.send([
			`${output instanceof Error ? '❌ Error' : '📤 Output'}:`,
			`${output.length > 2000 ? 'File was too large' : `\`\`\`js\n${output}\n\`\`\``}`,
		], output.length > 2000 ? { files: [{ attachment: Buffer.from(output), name: 'output.txt' }] } : {});
	}

	clean(input) {
		for (const env in process.env)
			if (/(TOKEN|POSTGRES|WEBHOOK_|_API)/ig.test(env)) input = String(input).replace(process.env[env], '[SECRET!]');

		return String(input)
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`);
	}
};