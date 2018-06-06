import { Event } from 'klasa';
import { GuildMember } from 'discord.js';

export default class extends Event {
	async run(member: GuildMember) {
		const role = member.guild.roles.find(r => r.name === `USER-${member.id}`);
		if (role) role.delete().catch(() => {});
	}
}
