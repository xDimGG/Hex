const Listener = require('../structures/Listener');
const { log, updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	async exec() {
		log(this.client.user.tag);
		updateActivity(this.client);

		this.client.bannedUsers = await this.client.guilds.get('361532026354139156').fetchBans();
	}
};