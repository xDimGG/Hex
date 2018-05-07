const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor() {
		super({
			args: [
				{ id: 'key' },
				{ id: 'value' },
			],
			clientPermissions: ['SEND_MESSAGES'],
			description: 'Bot configuration',
			userPermissions: ['ADMINISTRATOR'],
		});
	}

	async exec(message, { key, value }) {
		const config = await message.guild.get();
		if (!key) return message.channel.send(new MessageEmbed()
			.setTitle('Guild Settings')
			.setDescription('<> Required | [] Optional')
			.addField('Prefix', config.prefix, true)
			.setFooter(`Syntax: ${await this.handler.prefix(message)}config [<key> <value>]`)
			.setColor(0x00FF00)
		);

		if (!['prefix'].includes(key.toLowerCase())) return message.channel.send(`\`${key}\` is not a valid option, **Prefix**`);
		if (!value) return message.channel.send('Please provide a value');

		await message.guild.set({ [key.toLowerCase()]: value });
		message.channel.send(`Updated ${key} from ${config[key]} to ${value}`);
	}
};