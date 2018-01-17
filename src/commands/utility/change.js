const { Command } = require(`discord-akairo`);
const { MessageEmbed } = require(`discord.js`);
const { basename } = require(`path`);
const randomColor = require(`randomcolor`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0], `check`],
			channel: `guild`,
			clientPermissions: [`MANAGE_ROLES`],
			args: [
				{
					id: `color`,
					type: `string`
				}
			]
		});
		this.regex = /^(|#|0x)[0-9A-F]+$/i;
	}

	async exec(message, { color }) {
		if (color.toLowerCase().includes(`random`)) color = randomColor();
		if (!this.regex.test(color)) {
			return this.error(this.client, message,
				`Invalid hex value\n` +
				`Please input a value, "#000000", "0x000000", "000000", or "RANDOM"`
			);
		}

		const roleName = `USER-${message.author.id}`;
		const roleColor = parseInt(color.match(this.regex)[0].replace(`#`, ``).replace(`0x`, ``), 16);
		const { colorRole } = message.member;

		if (!colorRole) {
			message.guild.roles.create({
				name: roleName,
				color: roleColor,
				permissions: []
			}).then(role => {
				message.member.addRole(role).catch(error => this.error(this.client, message, error));
				return this.success(this.client, message, roleColor);
			}).catch(error => this.error(this.client, message, error));
		} else if (colorRole.position > message.guild.me.highestRole.position) {
			return this.error(this.client, message,
				`Invalid permissions\n` +
				`Cannot edit role "${colorRole.name}"\n` +
				`Please move the role below Hex's role.`
			);
		} else if (colorRole.name === roleName) {
			message.member.colorRole.setColor(roleColor)
				.then(() => this.success(this.client, message, roleColor))
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
			.setTitle(`✅ **Changed to #${roleColor}**`)
			.setColor(roleColor)
			.setTimestamp()
		).catch(() => message.react(`✅`).catch(() => null));
	}

	error(client, message, error) {
		message.channel.send(new MessageEmbed()
			.setTitle(`❌ **ERROR**`)
			.setDescription(`\`\`\`js\n${error}\n\`\`\``)
			.setColor(0xFF0000)
			.setTimestamp()
		).catch(() => message.react(`❌`).catch(() => null));
	}
}

module.exports = This;
