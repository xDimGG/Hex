const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, { emitter: process })
	}

	run(error) {
		this.client.log(error.stack, { code: `js` })
	}
}