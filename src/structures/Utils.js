const { post } = require('snekfetch');

module.exports = {
	updateActivity(client) {
		client.user.setActivity(`${client.guilds.size} ${client.guilds.size > 1 ? 'Guilds' : 'Guild'} | ${client.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`, { type: 'WATCHING' });
		if (!process.env.DEV && process.env.DBL_API) post(`https://discordbots.org/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.DBL_API } }).end();
	},
};