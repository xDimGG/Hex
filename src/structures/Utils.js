const { post } = require('snekfetch');
const { isArray, isError } = require('util');
const { console_webhook, avatar_url, username } = process.env;

module.exports = {
	log(...content) {
		console[isError(content) ? 'error' : 'log'](...content);
		if (!process.env.dev) post(`https://discordapp.com/api/webhooks/${console_webhook}`, { data: { avatar_url, content: isArray(content) ? content.join(' ') : content, username } }).end();
	},

	updateActivity(client) {
		client.user.setActivity(`${client.guilds.size} ${client.guilds.size > 1 ? 'Guilds' : 'Guild'} | ${client.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`, { type: 'WATCHING' });
		if (!process.env.dev && process.env.dbl_api) {
			post(`https://discordbots.org/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.dbl_api } }).end().catch(() => {});
			post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.dbots_api } }).end().catch(() => {});
		}
	},
};