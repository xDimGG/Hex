const Listener = require('../structures/Extensions/Listeners');
const { updateActivity } = require('../structures/Utils');

module.exports = class extends Listener {
	constructor() {
		super({ event: require('path').parse(__filename).name });
	}

	async exec() {
		updateActivity(this.client);

		this.client.bannedUsers = await this.client.guilds.get('361532026354139156').fetchBans();
	}
};