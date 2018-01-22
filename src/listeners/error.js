const { Listener } = require(`discord-akairo`);
const { basename } = require(`path`);

class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			eventName: basename(__filename).split(`.`)[0],
			emitter: `client`
		});
	}

	exec(info) {
		this.client.error(info);
	}
}

module.exports = This;