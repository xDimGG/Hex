const Listener = require('../structures/Extensions/Listeners');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: process });
	}

	exec(reason) {
		this.client.log(reason instanceof Error ? reason.stack : reason);
		console.log(reason instanceof Error ? reason.stack : reason);
	}
};