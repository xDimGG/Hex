const Command = require('../../structures/Extensions/Command');

module.exports = class extends Command {
	constructor() {
		super({
			aliases: ['guilds'],
			clientPermissions: ['SEND_MESSAGES'],
			ownerOnly: true,
		});
	}

	exec(message) {
		const longestCount = this.client.guilds.map(g => g.memberCount.toString().length).reduce((long, str) => Math.max(long, str), 0);
		const longestID = this.client.guilds.map(g => g.id.toString().length).reduce((long, str) => Math.max(long, str), 0);

		message.channel.send(this.client.guilds.sort((a, b) => b.memberCount - a.memberCount).map(g => `${g.memberCount}${' '.repeat(longestCount - g.memberCount.toString().length)} | ${g.id}${' '.repeat(longestID - g.id.toString().length)} | ${g.name}`).join('\n'), { code: true, split: true });
	}
};