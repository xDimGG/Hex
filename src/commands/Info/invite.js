const Command = require('../../structures/Command');

module.exports = class extends Command {
	constructor() {
		super({
			clientPermissions: ['SEND_MESSAGES'],
			description: 'Bot and Support server invite link',
		});
	}

	exec(message) {
		message.channel.send([
			`<https://bot.shaybox.com/${this.client.user.id}>`,
			'If you would like support, join my support server <https://discord.shaybox.com/>',
		]);
	}
};