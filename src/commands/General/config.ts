import { Message } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			args: [
				{ id: 'key' },
				{ id: 'value' },
			],
			channel: 'guild',
			description: 'Shows guild configuration settings',
			userPermissions: ['ADMINISTRATOR'],
		});
	}

	public async exec(message: Message, { key, value }: { key: string; value: string }) {
		const { prefix, role } = await message.guild.getConfig();
		const hexRole = message.guild.roles.get(role);

		if (!key) return message.channel.send([
			`Prefix  :: ${prefix} (Guild specific bot prefix)`,
			`Role    :: ${hexRole ? hexRole.name : 'none'} (Role to lock hex to)`,
			'',
			`Example: ${prefix}config prefix !`,
		], { code: 'asciidoc' });

		if (!['prefix', 'role'].includes(key.toLowerCase())) return message.channel.send(`${key.toLowerCase()} is not a valid option`);
		if (!value) return message.channel.send('Please provide a value');
		let dbValue: string | null = value;
		if (key.toLowerCase() === 'role') {
			if (message.mentions.roles.size > 0) dbValue = message.mentions.roles.first()!.id;
			if (['remove', 'none'].includes(dbValue.toLowerCase())) dbValue = null;
			else if (!message.guild.roles.get(dbValue)) return message.channel.send('Invalid role');
		}

		await message.guild.setConfig({ [key.toLowerCase()]: dbValue });
		await message.channel.send(`Updated ${key.toLowerCase()} to ${dbValue}`);
	}
}