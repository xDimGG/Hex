const Logger = require('../structures/Logger');
const	{ Listener } = require('discord-akairo');
const	{ basename } = require('path');

module.exports = class extends Listener {
	constructor() {
		super(basename(__filename).split('.')[0], { event: basename(__filename).split('.')[0] });
	}

	exec(error) {
		Logger.error(error.stack);
		console.log(error.stack);
		process.exit(1);
	}
};