const Command = require('../../structures/Command');

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
		if (!key) {
			const content = [
				'= Guild Settings =',
				`prefix :: ${config.prefix}`,
			];

			return message.channel.send(content, { code: 'asciidoc' });
		}

		if (!['prefix'].includes(key)) return message.channel.send(`\`${key}\` is not a valid option, **prefix**`);
		if (!value) return message.channel.send('Please provide a value');

		await message.guild.set({ [key]: value });
		message.channel.send(`Updated ${key} from ${config[key]} to ${value}`);
	}
};