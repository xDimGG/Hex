import { Collection, Message, MessageEmbed, MessageReaction, Role } from 'discord.js';
import * as tinycolor2 from 'tinycolor2';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			args: [{ id: 'color' }],
			clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
			description: 'Change your role color',
		});
	}

	public async exec(message: Message, { color }: { color: string }) {
		const { role } = await message.guild.getConfig();
		if (role && message.guild.roles.has(role) && !message.member.roles.has(role)) return message.channel.send([
			'You do not have permission to use this command',
			'Missing required role',
		]);

		const examples = [
			'#000', '000', '#369C', '369C', '#f0f0f6', 'f0f0f6', '#f0f0f688', 'f0f0f688',
			'rgb (255, 0, 0)', 'rgb 255 0 0', 'rgba (255, 0, 0, .5)',
			'hsl(0, 100%, 50%)', 'hsla(0, 100%, 50%, .5)', 'hsl(0, 100%, 50%)', 'hsl 0 1.0 0.5',
			'hsv(0, 100%, 100%)', 'hsva(0, 100%, 100%, .5)', 'hsv (0 100% 100%)', 'hsv 0 1 1',
			'RED', 'blanchedalmond', 'darkblue',
		];

		if (!color) color = Math.random().toString(16).slice(2, 8);
		if (tinycolor2(color).isValid) await this.randomColor(message, message, tinycolor2(color).toHex(), true);
		else await message.channel.send(`Invalid color, Ex. **${examples[Math.floor(Math.random() * examples.length)]}**`);
	}

	private async randomColor(message: Message, botMessage: Message, color: string, react: boolean) {
		const embed = new MessageEmbed()
			.addField('HEX', `#${color.toUpperCase()}`, true)
			.setImage(`https://via.placeholder.com/165x100/${color}/${color}`)
			.setFooter('Would you like to set this color?')
			.setColor(color);

		botMessage = message.id === botMessage.id ? await message.channel.send(embed) as Message : botMessage = await botMessage.edit(embed);

		if (react) {
			await botMessage.react('🔄');
			await botMessage.react('🇾');
			await botMessage.react('🇳');
		}

		await botMessage.awaitReactions(
			(r, u) => ['🔄', '🇾', '🇳'].includes(r.emoji.name) && u.id === message.author.id,
			{ errors: ['time'], max: 1, time: 30000 }
		).then(async (reactions: Collection<string, MessageReaction>) => {
			const reaction = reactions.first()!;
			await reaction.users.remove(message.author);

			if (reaction.emoji.name === '🔄') return this.randomColor(message, botMessage, Math.random().toString(16).slice(2, 8), false);
			await botMessage.reactions.removeAll();
			if (reaction.emoji.name === '🇾') await this.setColor(message, botMessage, color === '000000' ? '000001' : color);
			if (reaction.emoji.name === '🇳') await botMessage.edit('Canceled', { embed: undefined });
		}).catch(async (reason: any) => {
			await botMessage.reactions.removeAll();

			if (reason instanceof Collection && reason.size === 0) await botMessage.edit('You didn\'t react in time', { embed: null });
			else await botMessage.edit(reason);
		});
	}

	private async setColor(message: Message, botMessage: Message, color: string) {
		const member = await message.guild.members.fetch({ user: message.author, cache: false });
		const managedRole = message.guild.me.roles.filter(r => r.managed).first();
		const botRole = managedRole ? managedRole : message.guild.me.roles.highest;
		const colorRole = member.roles.color;
		const roleName = `USER-${message.author.id}`;
		const permissions = message.author.id === this.client.ownerID && color === '000001' ? message.guild.me.permissions : [];
		const position = managedRole ? managedRole.position - 1 : 1;

		if (colorRole)
			if (colorRole.name === roleName)
				if (colorRole.position < botRole.position) await colorRole.edit({ color, permissions, position });
				else return message.channel.send('I can not edit the role, too high');
			else
				if (colorRole.position < botRole.position) await message.guild.roles.create({ data: { name: roleName, color, permissions, position } })
					.then(async (role: Role) => member.roles.add(role));
				else return message.channel.send([
					`The role ${colorRole.name} is blocking my ability`,
					'Please move it below hex, remove it, it\'s color, or it from you',
				]);
		else
			if (member.roles.highest.position < botRole.position) await message.guild.roles.create({ data: { name: roleName, color, permissions, position } })
				.then(async (role: Role) => member.roles.add(role));
			else return message.channel.send([
				'I do not have permission to give you a role',
				'You are higher than me in the role list',
				'Please move me above you or you below me',
			]);

		await botMessage.edit(new MessageEmbed()
			.setTitle(`Updated to **#${color.toUpperCase()}**`)
			.setImage(`https://via.placeholder.com/150x50/${color}/${color}`)
			.setColor(color)
		);
	}
}