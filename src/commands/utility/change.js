const { Command } = require(`discord-akairo`);
const { MessageEmbed } = require(`discord.js`);
const { basename } = require(`path`);
const randomColor = require(`randomcolor`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0], `check`],
			clientPermissions: [`SEND_MESSAGES`, `MANAGE_ROLES`],
			description: `Changes name color`,
			channel: `guild`,
			args: [
				{
					id: `color`,
					type: `color`
				}
			]
		});
	}

	async exec(message, { color }) {
		if (!color) color = randomColor();

		const roleName = `USER-${message.author.id}`;
		const { colorRole } = message.member;

		if (!colorRole) {
			message.guild.roles.create({
				name: roleName,
				color,
				permissions: []
			}).then(role => {
				message.member.addRole(role).catch(error => this.error(this.client, message, error));
				return this.success(this.client, message, color);
			}).catch(error => this.error(this.client, message, error));
		} else if (colorRole.position > message.guild.me.highestRole.position) {
			return this.error(this.client, message,
				`Invalid permissions\n` +
				`Cannot edit role "${colorRole.name}"\n` +
				`Please move the role below Hex's role.`
			);
		} else if (colorRole.name === roleName) {
			message.member.colorRole.setColor(color)
				.then(() => this.success(this.client, message, color))
				.catch(error => this.error(this.client, message, error));
		} else if (colorRole.name !== roleName) {
			return this.error(this.client, message,
				`The role ${colorRole.name} is not set to DEFAULT\n` +
				`Please change the color of that role and try again.`
			);
		}
		return undefined;
	}

	success(client, message, roleColor) {
		message.channel.send(new MessageEmbed()
			.setTitle(`✅ **Changed to ${roleColor}**`)
			.setColor(roleColor)
		).catch(() => message.react(`✅`).catch(() => null));
	}

	error(client, message, error) {
		message.channel.send(new MessageEmbed()
			.setTitle(`❌ **ERROR**`)
			.setDescription(`\`\`\`js\n${error}\n\`\`\``)
			.setColor(0xFF0000)
		).catch(() => message.react(`❌`).catch(() => null));
	}
}

module.exports = This;
