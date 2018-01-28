const { Command } = require(`discord-akairo`);
const { basename, sep } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			clientPermissions: [`SEND_MESSAGES`],
			description: `Shows bots emojis`,
			typing: true,
			ownerOnly: true,
			args: [
				{
					id: `page`,
					type: `integer`,
					prompt: {
						start: `What page?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`,
					},
				},
			],
		});
	}

	async exec(message, { page }) {
		const pages = this.split(this.client.emojis.map(e => e).join(` `), 2000);

		if (page === `all`)
			for (let i = 0; i < pages.length; i++)
				message.channel.send(pages[i]);

		if (pages.length < 2) return message.channel.send(pages[0]);
		if (page < 1 || page > pages.length) return message.channel.send(`1 - ${pages.length}`);

		return message.channel.send(pages[page - 1]);
	}

	split(input, length) {
		const strs = [];
		while (input.length > length) {
			let pos = input.substring(0, length).lastIndexOf(` `);
			pos = pos <= 0 ? length : pos;
			strs.push(input.substring(0, pos));
			let i = input.indexOf(` `, pos) + 1;
			if (i < pos || i > pos + length) i = pos;
			input = input.substring(i);
		}
		strs.push(input);

		return strs;
	}
}

module.exports = This;