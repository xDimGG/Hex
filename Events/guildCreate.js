const Events = require(`../../../__Global/Structures/Events`)

class Event extends Events {
	run(client) {
		if (process.env.DEV) return
		client.updateActivity()
	}
}

module.exports = Event
