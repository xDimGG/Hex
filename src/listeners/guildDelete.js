const { Listener } = require(`discord-akairo`);
const { basename } = require(`path`);

class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], { event: [basename(__filename).split(`.`)[0]] });
	}

	async exec() {
		this.client.updateActivity();
	}
}

module.exports = This;