const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: process });
	}

	exec(error) {
		this.client.channels.get('361533828520476684').send(error.stack, { code: 'js' });
		console.log(error.stack);
		process.exit(1);
	}
};