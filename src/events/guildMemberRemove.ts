import { GuildMember } from 'discord.js';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public constructor() {
		super({
			emitter: 'client',
		});
	}

	public async exec(member: GuildMember) {
		const role = member.guild.roles.find(r => r.name === `USER-${member.id}`);
		if (role) await role.delete();
	}
}