const Listener = require('../structures/Listener');
const { updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	exec() {
		updateActivity(this.client);
	}
};