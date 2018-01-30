const { Command } = require(`discord-akairo`);
const { basename, sep } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			userPermissions: [`ADMINISTRATOR`],
			description: `Changes guild prefix`,
			typing: true,
			channel: `guild`,
			args: [
				{
					id: `prefix`,
					type: `string`,
					prompt: {
						start: `What prefix would you like to set?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`,
					},
				},
			],
		});
	}

	async exec(message, args) {
		const oldPrefix = this.client.settings.get(message.guild.id, `prefix`, `${this.client.user.username.toLowerCase()[0]}!`);

		await this.client.settings.set(message.guild.id, `prefix`, args.prefix);

		message.channel.send(`Prefix changed from \`${oldPrefix}\` to \`${args.prefix}\``);
	}
}

module.exports = This;