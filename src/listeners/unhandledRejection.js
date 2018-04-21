const Logger = require('../structures/Logger');
const	{ Listener } = require('discord-akairo');
const	{ basename } = require('path');

module.exports = class extends Listener {
	constructor() {
		super(basename(__filename).split('.')[0], { event: basename(__filename).split('.')[0] });
	}

	exec(reason) {
		Logger.error(reason instanceof Error ? reason.stack : reason);
		console.log(reason instanceof Error ? reason.stack : reason);
	}
};