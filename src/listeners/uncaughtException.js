const Logger = require('../structures/Logger');
const Listener = require('../structures/Extensions/Listeners');

module.exports = class extends Listener {
	constructor() {
		super({ event: require('path').parse(__filename).name });
	}

	exec(error) {
		Logger.error(error.stack);
		console.log(error.stack);
		process.exit(1);
	}
};