const { Event } = require(`klasa`)

module.exports = class This extends Event {
	constructor(...args) {
		super(...args, { emitter: process })
	}

	run(reason) {
		this.client.log(`Rejection:\n${reason instanceof Error ? reason.stack : reason}`, { code: `js` })
	}
}