const Listener = require('../structures/Listener');
const { log } = require('../structures/Utils');
const { BaseError } = require('sequelize');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: 'commandHandler' });
	}

	async exec(error, message) {
		log([
			`An unexpected error has occured in \`${message.channel.name}\` (\`${message.channel.id}\`)`,
			'Message content:',
			`\`\`\`\n${message.content}\n\`\`\``,
			'Error:',
			`\`\`\`\n${error.stack}\n\`\`\``,
		]);
		if (!message || error instanceof BaseError) return;
		await message.channel.send([
			'An unexpected error has occured',
			'Please report this to my support server <https://discord.shaybox.com/>',
			`\`\`\`\n${error.stack}\n\`\`\``,
		]);
	}
};