const Events = require(`../../../__Global/Structures/Events`)

class Event extends Events {
	run(client, member) {
		const role = member.roles.find(`name`, `USER-${member.id}`)
		if (role) role.delete().catch(error => member.guild.owner.send(`Could not delete role \`${role.name}\` \`\`\`\n${error}\n\`\`\``))
	}
}

module.exports = Event
