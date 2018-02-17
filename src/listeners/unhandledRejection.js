const { Listener } = require(`discord-akairo`)
const { basename } = require(`path`)

module.exports = class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			event: basename(__filename).split(`.`)[0],
			emitter: `process`,
		})
	}

	exec(reason) {
		this.client.log(reason instanceof Error ? `\`\`\`js\n${reason.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`)}\n\`\`\`` : reason)
	}
}