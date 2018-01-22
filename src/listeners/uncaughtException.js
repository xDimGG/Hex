const { Listener } = require(`discord-akairo`);
const { basename } = require(`path`);

class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			eventName: basename(__filename).split(`.`)[0],
			emitter: `process`
		});
	}

	exec(info) {
		this.client.error(info);
		process.exit();
	}
}

module.exports = This;
