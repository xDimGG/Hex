const Listener = require('../structures/Extensions/Listeners');
const { updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	constructor() {
		super({ event: require('path').parse(__filename).name });
	}

	exec() {
		updateActivity(this.client);
	}
};