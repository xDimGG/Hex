const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	exec(error, message) {
		if (!message) return;
		message.channel.send([
			'An unexpected error has occured',
			'Please report this to my support server <https://discord.shaybox.com/>',
			`\`\`\`${error.stack}\`\`\``,
		]);
	}
};