const Listener = require('../structures/Extensions/Listeners');

module.exports = class extends Listener {
	exec(member) {
		const role = member.roles.find('name', `USER-${member.id}`);
		if (role) role.delete().catch(() => member.guild.owner.send(`Could not delete role \`${role.name}\` You should manually delete it`));
	}
};