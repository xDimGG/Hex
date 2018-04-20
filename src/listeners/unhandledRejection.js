const	{ Listener } = require('discord-akairo');
const	{ basename } = require('path');

module.exports = class extends Listener {
	constructor() {
		super(basename(__filename).split('.')[0], { event: basename(__filename).split('.')[0] });
	}

	exec(reason) {
		console.log(reason instanceof Error ? reason.stack : reason);
	}
};