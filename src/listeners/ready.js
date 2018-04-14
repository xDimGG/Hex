const
	{ Listener } = require(`discord-akairo`),
	{ basename } = require(`path`)

module.exports = class extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], { event: basename(__filename).split(`.`)[0] })
	}

	exec() {
		this.client.updateActivity()
	}
}