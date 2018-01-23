const { Listener } = require(`discord-akairo`);
const { basename } = require(`path`);

class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			event: basename(__filename).split(`.`)[0],
			emitter: `process`
		});
	}

	exec(info) {
		this.client.log(info);
		process.exit();
	}
}

module.exports = This;
