const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	constructor() {
		super({ emitter: 'commandHandler' });
	}

	exec(message, _, type, missing) {
		message.channel.send(`${type === 'client' ? 'I am' : 'You are'} missing ${missing} permissions`);
	}
};