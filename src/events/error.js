const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {})
	}

	run(error) {
		this.client.log(error)
	}
}