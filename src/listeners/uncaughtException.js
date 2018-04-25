const Listener = require('../structures/Extensions/Listeners');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: process });
	}

	exec(error) {
		this.client.log(error.stack);
		console.log(error.stack);
		process.exit(1);
	}
};