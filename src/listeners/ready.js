const Listener = require('../structures/Listener');
const { log, updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	exec() {
		log(this.client.user.tag);
		updateActivity(this.client);
	}
};