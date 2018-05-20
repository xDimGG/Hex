const Listener = require('../structures/Listener');
const { updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	exec() {
		console.log(this.client.user.tag);
		updateActivity(this.client);
		this.client.channels.get('361533828520476684').send(this.client.user.tag);
	}
};