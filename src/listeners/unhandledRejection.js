const Logger = require('../structures/Logger');
const Listener = require('../structures/Extensions/Listeners');

module.exports = class extends Listener {
	constructor() {
		super({ event: require('path').parse(__filename).name });
	}

	exec(reason) {
		Logger.error(reason instanceof Error ? reason.stack : reason);
		console.log(reason instanceof Error ? reason.stack : reason);
	}
};