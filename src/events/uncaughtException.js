const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, { emitter: process })
	}

	run(error) {
		this.client.console.error(error)
		process.exit(1)
	}
}