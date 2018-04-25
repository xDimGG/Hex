const Listener = require('../structures/Listeners');
const { updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	exec() {
		updateActivity(this.client);
	}
};