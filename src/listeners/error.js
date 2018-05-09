const Listener = require('../structures/Listener');
const { log } = require('../structures/Utils');
const { BaseError } = require('sequelize');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: 'commandHandler' });
	}

	async exec(error, message) {
		log(error);
		if (!message) return;
		if (error instanceof BaseError) return;
		await message.channel.send([
			'An unexpected error has occured',
			'Please report this to my support server <https://discord.shaybox.com/>',
			`\`\`\`${error.stack}\`\`\``,
		]);
		await message.channel.stopTyping();
	}
};