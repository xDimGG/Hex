const
	{ error, log, updateActivity } = require(`../structures/Utils`),
	{ Event } = require(`klasa`)

module.exports = class This extends Event {
	constructor(...args) {
		super(...args, {})
	}

	run() {
		updateActivity(this.client)
		this.client.console.log = log
		this.client.console.error = error
	}
}