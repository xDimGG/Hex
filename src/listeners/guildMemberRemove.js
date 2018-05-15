const Listener = require('../structures/Listener');

module.exports = class extends Listener {
	exec(member) {
		const role = member.guild.roles.find(r => r.name === `USER-${member.id}`);
		if (role) role.delete().catch(() => {});
	}
};