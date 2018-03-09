const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {})
	}

	run(warning) {
		this.client.log(warning)
	}
}