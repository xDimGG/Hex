const { updateActivity } = require(`../structures/Utils`)
const { Listener } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], { event: [basename(__filename).split(`.`)[0]] })
	}

	exec() {
		updateActivity()
	}
}