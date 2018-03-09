const { Event } = require(`klasa`)

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {})
	}

	run(member) {
		const role = member.roles.find(`name`, `USER-${member.id}`)
		if (role) role.delete().catch(() => member.guild.owner.send(`Could not delete role \`${role.name}\` You should manually delete it`))
	}
}