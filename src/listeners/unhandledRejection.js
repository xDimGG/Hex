const { Listener } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			event: basename(__filename).split(`.`)[0],
			emitter: `process`,
		})
	}

	exec(reason) {
		this.client.log(reason instanceof Error ? reason.stack : reason, { code: `js` })
	}
}