import { Command, KlasaClient, CommandStore, KlasaMessage } from 'klasa';
import { Collection, MessageReaction, Role, MessageEmbed, Message } from 'discord.js';
import * as tinycolor from 'tinycolor2';
import { guildSchema } from '../../types/Schemas';

export default class extends Command {
	private readonly examples: string[];
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			description: 'Change your name color',
			runIn: ['text'],
			requiredPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS', 'MANAGE_MESSAGES', 'EMBED_LINKS'],
			usage: '(Color:color)',
		});

		this.examples = [
			'#000', '000', '#369C', '369C', '#f0f0f6', 'f0f0f6', '#f0f0f688', 'f0f0f688',
			'rgb (255, 0, 0)', 'rgb 255 0 0', 'rgba (255, 0, 0, .5)',
			'hsl(0, 100%, 50%)', 'hsla(0, 100%, 50%, .5)', 'hsl(0, 100%, 50%)', 'hsl 0 1.0 0.5',
			'hsv(0, 100%, 100%)', 'hsva(0, 100%, 100%, .5)', 'hsv (0 100% 100%)', 'hsv 0 1 1',
			'RED', 'blanchedalmond', 'darkblue',
		];

		this.createCustomResolver('color', async (arg, possible, message, params) => {
			if (!arg) return Math.random().toString(16).slice(2, 8);
			const color = tinycolor(arg);
			if (color.isValid()) return color.toHex();
			else throw new Error(`Invalid color, Ex. **${this.examples[Math.floor(Math.random() * this.examples.length)]}**`);
		});
	}

	async run(message: KlasaMessage, [color]: string[]) {
		const { hexrole } = message.guild.configs as guildSchema;
		if (hexrole && !message.member.roles.has(hexrole)) return message.send('You do not have the hex role');

		return this.randomColor(message, color, true);
	}

	async randomColor(message: KlasaMessage, color: string, react: boolean) {
		const botMessage = await message.send(new MessageEmbed()
			.addField('HEX', `#${color.toUpperCase()}`, true)
			.setImage(`https://via.placeholder.com/165x100/${color}/${color}`)
			.setFooter('Would you like to set this color?')
			.setColor(color)
		) as Message;

		if (react) {
			await botMessage.react('🔄');
			await botMessage.react('🇾');
			await botMessage.react('🇳');
		}

		await botMessage.awaitReactions(
			(r, u) => ['🔄', '🇾', '🇳'].includes(r.emoji.name) && u.id === message.author.id,
			{ errors: ['time'], max: 1, time: 30000 }
		).then(async (reactions: Collection<string, MessageReaction>) => {
			const reaction = reactions.first();
			if (!reaction) return undefined;
			await reaction.users.remove(message.author);

			if (reaction.emoji.name === '🔄') return this.randomColor(message, Math.random().toString(16).slice(2, 8), false);
			await botMessage.reactions.removeAll();
			if (reaction.emoji.name === '🇾') return this.setColor(message, color === '000000' ? '000001' : color);
			if (reaction.emoji.name === '🇳') return message.send('Canceled', { embed: undefined });
		}).catch(async () => {
			await botMessage.reactions.removeAll();

			return message.send('You didn\'t react in time', { embed: undefined });
		});

		return message;
	}

	async setColor(message: KlasaMessage, color: string) {
		if (!message.member) await message.guild.members.fetch(message.author);

		const { color: colorRole } = message.member.roles;
		const managedRole = message.guild.me.roles.filter(r => r.managed).first();
		const botRole = managedRole ? managedRole : message.guild.me.roles.highest;

		const roleName = `USER-${message.author.id}`;
		const permissions = message.author.id === '358558305997684739' && color === '000001' ? message.guild.me.permissions : [];
		const position = managedRole ? managedRole.position - 1 : 1;

		if (colorRole) {
			if (colorRole.name === roleName) {
				if (colorRole.position > botRole.position) { return message.send([
					`Role \`${colorRole.name}\` is higher than my role \`${botRole.name}\``,
					`Please move the \`${botRole.name}\` role to the top of the list`,
					`Or move \`${colorRole.name}\` below \`${botRole.name}\``,
				], { files: ['http://shay.is-your.pet/Gmaw.png'] });
				}

				await colorRole.edit({ color, permissions, position });
			} else if (colorRole.name !== roleName) {
				if (colorRole.position > position) { return message.send([
					`Role \`${colorRole.name}\` has it's own color`,
					`Please move the \`${botRole.name}\` role to the top of the list`,
					`Or remove \`${colorRole.name}\`'s color`,
				], { files: ['http://shay.is-your.pet/Gmaw.png'] });
				}

				await message.guild.roles.create({ data: { color, name: roleName, permissions, position } })
					.then(async (role: Role) => message.member.roles.add(role));
			}
		} else { await message.guild.roles.create({ data: { color, name: roleName, permissions, position } })
			.then(async (role: Role) => message.member.roles.add(role));
		}

		return message.send(new MessageEmbed()
			.setTitle(`Updated to **#${color.toUpperCase()}**`)
			.setImage(`https://via.placeholder.com/150x50/${color}/${color}`)
			.setColor(color)
		);
	}
}
