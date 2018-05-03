const Listener = require('../structures/Listener');
const { log } = require('../structures/Utils');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: process });
	}

	exec(reason) {
		log(reason);
	}
};