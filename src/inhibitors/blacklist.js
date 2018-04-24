const { Inhibitor } = require('discord-akairo');

module.exports = class extends Inhibitor {
	constructor() {
		super({
			reason: require('path').parse(__filename).name,
			type: 'all',
		});
	}

	exec(message) {
		const banned = this.client.bannedUsers.has(message.author.id);
		if (banned) message.channel.send('You have been banned from using me.');

		return banned;
	}
};