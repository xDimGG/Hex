const	{ Inhibitor } = require('discord-akairo');
const	{ basename } = require('path');

module.exports = class extends Inhibitor {
	constructor() {
		super(basename(__filename).split('.')[0], {
			reason: basename(__filename).split('.')[0],
			type: 'all',
		});
	}

	exec(message) {
		const blacklist = ['212252550689193985'];

		return blacklist.includes(message.author.id);
	}
};