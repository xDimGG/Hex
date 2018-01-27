const { Command } = require(`discord-akairo`);
const { MessageEmbed } = require(`discord.js`);
const { basename } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0], `undo`],
			clientPermissions: [`SEND_MESSAGES`, `MANAGE_ROLES`],
			description: `Removes custom hex role`,
			typing: true,
			channel: `guild`,
			args: [
				{
					id: `member`,
					type: `member`,
					default: message => message.member,
					allow: message => message.member.hasPermission(`MANAGE_ROLES`)
				}
			]
		});
	}

	async exec(message, { member }) {
		const role = member.roles.find(`name`, `USER-${member.id}`);

		if (!role) {
			return message.channel.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`You dont have one!`)
				.setColor(0xFF0000)
			);
		}

		role.delete().then(role => {
			message.channel.send(new MessageEmbed()
				.setTitle(`✅ **Removed ${role.hexColor.toUpperCase().replace(`#`, ``)}**`)
				.setColor(role.color)
			);
		}).catch(error => {
			message.channel.send(new MessageEmbed()
				.setTitle(`❌ **ERROR**`)
				.setDescription(`\`\`\`\n${error}\n\`\`\``)
				.setColor(0xFF0000)
			);
		});
		return undefined;
	}
}

module.exports = This;
