const { Command } = require(`discord-akairo`)
const { basename, sep } = require(`path`)

module.exports = class This extends Command {
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
					id: `newPrefix`,
					type: `string`,
					prompt: {
						start: `What prefix would you like to set?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`,
					},
				},
			],
		})
	}

	async exec(message, { newPrefix }) {
		const { prefix: oldPrefix } = await message.guild.get()

		await message.guild.set({ prefix: newPrefix })

		message.channel.send(`Prefix changed from \`${oldPrefix}\` to \`${newPrefix}\``)
	}
}