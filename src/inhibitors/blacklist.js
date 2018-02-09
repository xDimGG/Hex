const { Inhibitor } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Inhibitor {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			reason: basename(__filename).split(`.`)[0],
			type: `all`,
		})
	}

	exec(message) {
		const blacklist = [`117694025795895299`]

		return blacklist.includes(message.author.id)
	}
}