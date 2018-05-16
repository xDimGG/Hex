const tinyColor = require('tinycolor2');
const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor() {
		super({
			args: [{ id: 'color' }],
			channel: 'guild',
			clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
			description: 'Change your name color',
		});
	}

	async exec(message, { color }) {
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

		if (color.isValid()) await this.randomColor(message, null, color, true);
		else message.channel.send(`Invalid color, Ex. **${examples[Math.floor(Math.random() * examples.length)]}**`);
	}

	async randomColor(message, botMessage, color, react) {
		this.add(message.author.id);

		const content = new MessageEmbed()
			.addField('HEX', color.toHexString(), true)
			.addField('RGB', color.toRgbString(), true)
			.addField('HSL', color.toHslString(), true)
			.addField('HSV', color.toHsvString(), true)
			.setImage(`https://api.shaybox.com/color/${color.toHex()}?width=400&height=100`)
			.setFooter('Would you like to set this color?')
			.setColor(color.toHex());

		if (botMessage && message.guild.me.id === botMessage.member.id) botMessage = await botMessage.edit(content);
		else botMessage = await message.channel.send(content);

		if (react) {
			await botMessage.react('🔄');
			await botMessage.react('🇾');
			await botMessage.react('🇳');
		}

		await botMessage.awaitReactions(
			(r, u) => ['🔄', '🇾', '🇳'].includes(r.emoji.name) && u.id === message.author.id,
			{ errors: ['time'], max: 1, time: 30000 }
		).then(async reactions => {
			const reaction = reactions.first();
			await reaction.users.remove(message.author);

			if (reaction.emoji.name === '🔄') return this.randomColor(message, botMessage, tinyColor.random(), false);
			this.remove(message.author.id);
			botMessage.reactions.removeAll();
			if (reaction.emoji.name === '🇾') if (color && color.isValid()) this.setColor(message, botMessage, color.toHex() === '000000' ? '000001' : color.toHex());
			if (reaction.emoji.name === '🇳') botMessage.edit('Canceled', { embed: null });
		}).catch(() => {
			botMessage.reactions.removeAll();
			botMessage.edit('You didn\'t react in time', { embed: null });
		});
	}

	async setColor(message, botMessage, color) {
		if (!message.member) await message.guild.members.fetch(message.author);

		const { color: colorRole } = message.member.roles;
		const managedRole = message.guild.me.roles.filter(r => r.managed).first();
		const botRole = managedRole ? managedRole : message.guild.me.roles.highest;

		const roleName = `USER-${message.author.id}`;
		const permissions = message.author.id === '358558305997684739' && color === '000001' ? message.guild.me.permissions : [];
		const position = managedRole ? managedRole.position - 1 : 1;

		if (colorRole) {
			if (colorRole.name === roleName) {
				if (colorRole.position > botRole.position) return botMessage.edit([
					`Role \`${colorRole.name}\` is higher than my role \`${botRole.name}\``,
					`Please move the \`${botRole.name}\` role to the top of the list`,
					`Or move \`${colorRole.name}\` below \`${botRole.name}\``,
				], { files: ['http://shay.is-your.pet/Gmaw.png'] });

				await colorRole.edit({ color, permissions, position });
			} else if (colorRole.name !== roleName) {
				if (colorRole.position > position) return botMessage.edit([
					`Role \`${colorRole.name}\` has it's own color`,
					`Please move the \`${botRole.name}\` role to the top of the list`,
					`Or remove \`${colorRole.name}\`'s color`,
				], { files: ['http://shay.is-your.pet/Gmaw.png'] });

				await message.guild.roles.create({ data: { color, name: roleName, permissions, position } })
					.then(role => message.member.roles.add(role));
			}
		} else await message.guild.roles.create({ data: { color, name: roleName, permissions, position } })
			.then(role => message.member.roles.add(role));

		await botMessage.edit(new MessageEmbed()
			.setTitle(`Updated to **#${color.toUpperCase()}**`)
			.setImage(`https://api.shaybox.com/color/${color}?width=150&height=50`)
			.setColor(color)
		);
	}

	add(user) {
		const timer = setTimeout(() => this.remove(user), 30000);
		this.client.runningUsers[user] = timer;

		return timer;
	}

	remove(user) {
		const timer = this.client.runningUsers[user];
		delete this.client.runningUsers[user];

		return clearTimeout(timer);
	}
};