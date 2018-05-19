const Listener = require('../structures/Listener');
const { Error: BaseError } = require('sequelize');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: 'commandHandler' });
	}

	async exec(error, message) {
		console.error(error);
		if (!message || (error instanceof BaseError)) return;
		await message.channel.send([
			'An unexpected error has occured',
			'Please report this to my support server <https://discord.shaybox.com/>',
			`\`\`\`\n${error.stack}\n\`\`\``,
		]);
	}
};