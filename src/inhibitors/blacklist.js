const { Inhibitor } = require('discord-akairo');

module.exports = class extends Inhibitor {
	constructor() {
		super({
			reason: require('path').parse(__filename).name,
			type: 'all',
		});
	}

	exec(message) {
		const blacklist = ['212252550689193985'];

		return blacklist.includes(message.author.id);
	}
};