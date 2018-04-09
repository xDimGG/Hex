const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, { emitter: process })
	}

	run(error) {
		this.client.log(`Exception:\n${error.stack}`, { code: `js` })
	}
}