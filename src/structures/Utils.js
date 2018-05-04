const { isArray, isError, inspect } = require('util');
const { post } = require('snekfetch');

module.exports = {
	log(...content) {
		console[content instanceof Error ? 'error' : 'log'](...content);
		if (isArray(content)) content = content.join('\n');
		if (isError(content)) content = inspect(content, { depth: 10 });
		if (!process.env.DEV) post(`https://discordapp.com/api/webhooks/${process.env.CONSOLE}`, { data: { avatar_url: 'https://api.shaybox.com/discord/avatar/361796552165031936', content, username: 'Hex' } });
	},

	updateActivity(client) {
		client.user.setActivity(`${client.guilds.size} ${client.guilds.size > 1 ? 'Guilds' : 'Guild'} | ${client.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`, { type: 'WATCHING' });
		if (!process.env.DEV && process.env.DBL_API) {
			post(`https://discordbots.org/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.DBL_API } }).end();
			post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.DBOTS_API } }).end();
		}
	},
};