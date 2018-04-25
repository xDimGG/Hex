const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: process });
	}

	exec(reason) {
		this.client.channels.get('361533828520476684').send(reason instanceof Error ? reason.stack : reason, { code: 'js' });
		console.log(reason instanceof Error ? reason.stack : reason);
	}
};