const	{ Command } = require('discord-akairo');
const	{ basename } = require('path');

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split('.')[0], {
			aliases: [basename(__filename).split('.')[0]],
			args: [
				{ id: 'key' },
				{ id: 'value' },
			],
			clientPermissions: ['SEND_MESSAGES'],
			description: 'Bot and Support server invite link',
		});
	}

	async exec(message, { key, value }) {
		const config = await message.guild.get();
		if (!key) {
			const content = [
				'= Guild Settings =',
				`prefix :: ${config.prefix}`,
			];

			return message.channel.send(content.join('\n'), { code: 'asciidoc' });
		}

		if (!['prefix'].includes(key)) return message.channel.send(`\`${key}\` is not a valid option, **prefix**`);
		if (!value) return message.channel.send('Please provide a value');

		await message.guild.set({ [key]: value });
		message.channel.send(`Updated ${key} from ${config[key]} to ${value}`);
	}
};