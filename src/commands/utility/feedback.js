const { Command } = require(`discord-akairo`);
const { basename, sep } = require(`path`);
const { inspect } = require(`util`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Sends feedback or support`,
			args: [
				{
					id: `string`,
					type: `string`,
					match: `text`,
					prompt: {
						start: `What would you like to submit?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`
					}
				}
			]
		});
	}

	async exec(message, { string }) {
		this.client.guilds.get(this.client.options.serverID).channels.find(`name`, `feedback`).send(
			`\`${message.author.tag}\` (${message.author.id})\n` +
			`\`${message.channel.name}\` (${message.channel.id}) in \`${message.guild.name}\` (${message.guild.id})\n` +
			`\`\`\`\n${this.client.clean(string)}\n\`\`\``
		).then(async m => {
			await m.react(`👍`);
			await m.react(`👎`);
		});

		message.channel.send(
			`Thank you for your feedback!\n` +
			`This command can be used to suggest ideas, or ask for help.\n` +
			`Please note: If you spam this, you will be blacklisted from using the bot.`
		);
	}
}

module.exports = This;