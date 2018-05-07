const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: 'commandHandler' });
	}

	async exec(error, message) {
		if (!message) return;
		await message.channel.send([
			'An unexpected error has occured',
			'Please report this to my support server <https://discord.shaybox.com/>',
			`\`\`\`${error.stack}\`\`\``,
		]);
		await message.channel.stopTyping();
	}
};