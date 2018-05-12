const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	exec(member) {
		const role = member.guild.roles.find('name', `USER-${member.id}`);
		if (role) role.delete().catch(() => {});
	}
};