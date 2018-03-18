const { updateActivity } = require(`../structures/Utils`)
const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {})
	}

	run() {
		updateActivity(this.client)
		this.client.temp = { disabledUsers: [] }
	}
}