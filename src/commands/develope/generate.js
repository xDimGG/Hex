const { Command } = require(`discord-akairo`);
const { basename, sep } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Gives guild invite`,
			typing: true,
			hide: true,
			ownerOnly: true,
			args: [
				{
					id: `guild`,
					type: `guild`,
					prompt: {
						start: `What guild?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`
					}
				}
			]
		});
	}

	async exec(message, { guild }) {
		this.client.defaultChannel(this.client.guilds.get(guild)).createInvite({ maxAge: 1 })
			.then(invite => message.channel.send(invite.url))
			.catch(error => message.channel.send(error, { code: true }));
	}
}

module.exports = This;
