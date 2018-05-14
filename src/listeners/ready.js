const Listener = require('../structures/Listener');
const { log, updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	exec() {
		console.log(this.client.user.tag);
		log(this.client.user.tag);
		updateActivity(this.client);
	}
};