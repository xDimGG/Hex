const { Listener } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			event: basename(__filename).split(`.`)[0],
			emitter: `client`,
		})
	}

	exec(info) {
		this.client.log(info)
	}
}