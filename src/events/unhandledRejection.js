const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, { emitter: process })
	}

	run(reason) {
		this.client.log(reason instanceof Error ? reason.stack : reason, { code: `js` })
	}
}