const Listener = require('../structures/Extensions/Listeners');
const { updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	exec() {
		updateActivity(this.client);
	}
};