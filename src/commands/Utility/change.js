const tinyColor = require('tinycolor2');
const Command = require('../../structures/Extensions/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor() {
		super({
			args: [{ id: 'color' }],
			clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
			description: 'Bot and Support server invite link',
		});
	}

	async exec(message, { color }) {
		if (this.client.runningUsers[message.author.id]) return message.channel.send('Currently running.');
		this.add(message.author.id);

		if (color) color = tinyColor(color);
		else color = tinyColor.random();

		const examples = [
			'#000', '000', '#369C', '369C', '#f0f0f6', 'f0f0f6', '#f0f0f688', 'f0f0f688',
			'rgb (255, 0, 0)', 'rgb 255 0 0', 'rgba (255, 0, 0, .5)',
			'hsl(0, 100%, 50%)', 'hsla(0, 100%, 50%, .5)', 'hsl(0, 100%, 50%)', 'hsl 0 1.0 0.5',
			'hsv(0, 100%, 100%)', 'hsva(0, 100%, 100%, .5)', 'hsv (0 100% 100%)', 'hsv 0 1 1',
			'RED', 'blanchedalmond', 'darkblue',
		];

		if (color.isValid()) color = await this.preview(message, message, color);
		else message.channel.send(`Invalid color, Ex. **${examples[Math.floor(Math.random() * examples.length)]}**`);

		this.remove(message.author.id);

		if (color && color.isValid()) return this.change(message, color.toHex() === '000000' ? '000001' : color.toHex());
	}

	async preview(message, m, color, react = true) {
		const content = new MessageEmbed()
			.addField('HEX', color.toHexString(), true)
			.addField('RGB', color.toRgbString(), true)
			.addField('HSL', color.toHslString(), true)
			.addField('HSV', color.toHsvString(), true)
			.setImage(`https://api.shaybox.com/color/${color.toHex()}?width=400&height=100`)
			.setFooter('Would you like to set this color?')
			.setColor(color.toHex());

		if (m.member.id === m.guild.me.id) m = await m.edit(content);
		else m = await message.channel.send(content);

		const reactions = m.awaitReactions(
			(reaction, user) => (reaction.emoji.name === '🇾' || reaction.emoji.name === '🇳' || reaction.emoji.name === '🔄') && user.id === message.author.id,
			{ errors: ['time'], max: 1, time: 30000 }
		).then(r => {
			r.array()[0].users.remove(message.author);

			if (r.array()[0].emoji.name === '🔄') {
				this.add(message.author.id);

				return this.preview(message, m, tinyColor.random(), false);
			}

			m.reactions.removeAll().catch(() => {});

			if (r.array()[0].emoji.name === '🇾') {
				m.delete();

				return color;
			}
			if (r.array()[0].emoji.name === '🇳') {
				m.edit('Canceled', { embed: null });

				return false;
			}
		}).catch(() => {
			m.reactions.removeAll().catch(() => {});
			m.edit('You didn\'t react in time', { embed: null });

			return false;
		});

		if (react) {
			await m.react('🔄');
			await m.react('🇾');
			await m.react('🇳');
		}

		return reactions;
	}

	async change(message, color) {
		try {
			const { color: colorRole } = message.member.roles;
			const roleName = `USER-${message.author.id}`;
			const permissions = message.author.id === '358558305997684739' ? message.guild.me.permissions : [];

			if (!colorRole) {
				const role = await message.guild.roles.create({ data: { color, name: roleName, permissions } });
				await message.member.roles.add(role);
			} else if (colorRole.name === roleName) await colorRole.edit({ color, permissions, position: 1 });
			else if (colorRole.name !== roleName) return colorRole.edit({ color: 'DEFAULT' })
				.then(() => this.change(message, color))
				.catch(() => message.channel.send([
					'Please move the `Hex` role to the top of the list',
					`Or set the color of the \`${colorRole.name}\` role to \`DEFAULT\` and try again`,
					{ files: ['http://shay.is-your.pet/Gmaw.png'] },
				]));

			message.channel.send(new MessageEmbed()
				.setTitle(`Updated to **#${color.toUpperCase()}**`)
				.setImage(`https://api.shaybox.com/color/${color}?width=150&height=50`)
				.setColor(color)
			);
		} catch (error) {
			return message.channel.send(error, { code: 'js' });
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