const { Listener } = require(`discord-akairo`);
const { basename } = require(`path`);

class This extends Listener {
	constructor() {
		super(basename(__filename).split(`.`)[0], { event: [basename(__filename).split(`.`)[0]] });
	}

	async exec(member) {
		const role = member.roles.find(`name`, `USER-${member.id}`);
		if (role) role.delete().catch(() => member.guild.owner.send(`Could not delete role \`${role.name}\` You should manually delete it`));
	}
}

module.exports = This;