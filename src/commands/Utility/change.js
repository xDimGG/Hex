const tinyColor = require('tinycolor2');
const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor() {
		super({
			args: [{ id: 'color' }],
			clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
			description: 'Change your name color',
		});
	}

	exec(message, { color }) {
		if (this.client.runningUsers[message.author.id]) return message.channel.send('Currently running.');

		if (color) color = tinyColor(color);
		else color = tinyColor.random();

		const examples = [
			'#000', '000', '#369C', '369C', '#f0f0f6', 'f0f0f6', '#f0f0f688', 'f0f0f688',
			'rgb (255, 0, 0)', 'rgb 255 0 0', 'rgba (255, 0, 0, .5)',
			'hsl(0, 100%, 50%)', 'hsla(0, 100%, 50%, .5)', 'hsl(0, 100%, 50%)', 'hsl 0 1.0 0.5',
			'hsv(0, 100%, 100%)', 'hsva(0, 100%, 100%, .5)', 'hsv (0 100% 100%)', 'hsv 0 1 1',
			'RED', 'blanchedalmond', 'darkblue',
		];

		if (color.isValid()) this.randomColor(message, message, color, true);
		else message.channel.send(`Invalid color, Ex. **${examples[Math.floor(Math.random() * examples.length)]}**`);
	}

	async randomColor(message, botMessage, color, react) {
		try {
			this.add(message.author.id);

			const content = new MessageEmbed()
				.addField('HEX', color.toHexString(), true)
				.addField('RGB', color.toRgbString(), true)
				.addField('HSL', color.toHslString(), true)
				.addField('HSV', color.toHsvString(), true)
				.setImage(`https://api.shaybox.com/color/${color.toHex()}?width=400&height=100`)
				.setFooter('Would you like to set this color?')
				.setColor(color.toHex());

			if (message.guild.me.id === botMessage.member.id) botMessage = await botMessage.edit(content);
			else botMessage = await message.channel.send(content);

			if (react) {
				await botMessage.react('🔄');
				await botMessage.react('🇾');
				await botMessage.react('🇳');
			}

			return botMessage.awaitReactions(
				(r, u) => ['🔄', '🇾', '🇳'].includes(r.emoji.name) && u.id === message.author.id,
				{ errors: ['time'], max: 1, time: 30000 }
			).then(async r => {
				await r.array()[0].users.remove(message.author);

				if (r.array()[0].emoji.name === '🔄') return this.randomColor(message, botMessage, tinyColor.random(), false);
				this.remove(message.author.id);
				await botMessage.reactions.removeAll();
				if (r.array()[0].emoji.name === '🇾') if (color && color.isValid()) return this.setColor(message, botMessage, color.toHex() === '000000' ? '000001' : color.toHex());
				if (r.array()[0].emoji.name === '🇳') await botMessage.edit('Canceled', { embed: null });
			}).catch(() => {
				botMessage.reactions.removeAll();
				botMessage.edit('You didn\'t react in time', { embed: null });

				return false;
			});
		} catch (error) {
			return message.channel.send(error, { code: 'js' });
		}
	}

	async setColor(message, botMessage, color) {
		try {
			const { color: colorRole } = message.member.roles;
			const roleName = `USER-${message.author.id}`;
			const permissions = message.author.id === '358558305997684739' ? message.guild.me.permissions : [];

			if (!colorRole) {
				const role = await message.guild.roles.create({ data: { color, name: roleName, permissions } });
				await message.member.roles.add(role);
			} else if (colorRole.name === roleName) await colorRole.edit({ color, permissions, position: 1 });
			else if (colorRole.name !== roleName) return colorRole.edit({ color: 'DEFAULT' })
				.then(() => this.setColor(message, color))
				.catch(() => botMessage.edit([
					'Please move the `Hex` role to the top of the list',
					`Or set the color of the \`${colorRole.name}\` role to \`DEFAULT\` and try again`,
					{ files: ['http://shay.is-your.pet/Gmaw.png'] },
				]));

			await botMessage.edit(new MessageEmbed()
				.setTitle(`Updated to **#${color.toUpperCase()}**`)
				.setImage(`https://api.shaybox.com/color/${color}?width=150&height=50`)
				.setColor(color)
			);
		} catch (error) {
			return botMessage.edit(error, { code: 'js' });
		}
	}

	add(user) {
		const timer = setTimeout(() => this.remove(user), 1000 * 60);
		this.client.runningUsers[user] = timer;

		return timer;
	}

	remove(user) {
		const timer = this.client.runningUsers[user];
		delete this.client.runningUsers[user];

		return clearTimeout(timer);
	}
};