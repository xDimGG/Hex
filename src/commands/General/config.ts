import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';
import { MessageEmbed } from 'discord.js';
import { GuildSchema } from '../../typings';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			description: 'Get/Set guild configuration values',
			usage: '(Key:key) (Value:value)',
			usageDelim: ' ',
			permissionLevel: 6,
		});

		this.createCustomResolver('key', async (arg, possible, message, params) => {
			if (!arg) return undefined;
			if (!['prefix', 'hexrole'].includes(arg.toLowerCase())) return message.send('Invalid key');

			return arg;
		});
		this.createCustomResolver('value', async (arg, possible, message, params) => {
			if (params[0] && !arg) throw new Error('You must spesify a value');
			if (!arg) return undefined;

			return arg;
		});
	}

	async run(message: KlasaMessage, [key, value]: [KlasaMessage | string | undefined][]) {
		if (key instanceof KlasaMessage || value instanceof KlasaMessage) return message;
		if (typeof key !== 'string' || typeof value !== 'string') {
			const { prefix, hexrole } = message.guild.configs as GuildSchema;

			return message.send(new MessageEmbed()
				.addField('Prefix', prefix, true)
				.addField('HexRole', hexrole, true)
				.setFooter(`Example: ${message.guildConfigs.get('prefix')}config prefix !`)
				.setColor(0x00FF00)
			);
		}

		await message.guildConfigs.update(key, value, message.guild);

		return message.send('Config updated!');
	}
}
