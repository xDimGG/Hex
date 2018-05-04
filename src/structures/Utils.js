const { post } = require('snekfetch');
const { isError, inspect } = require('util');

module.exports = {
	log(...input) {
		console[input instanceof Error ? 'error' : 'log'](...input);
		if (isError(input)) input = inspect(input, { depth: 10 });
		if (!process.env.DEV) this.client.channels.get('361533828520476684').send(...input, { code: 'js' });
	},

	updateActivity(client) {
		client.user.setActivity(`${client.guilds.size} ${client.guilds.size > 1 ? 'Guilds' : 'Guild'} | ${client.guilds.reduce((a, b) => a + b.memberCount, 0)} Members`, { type: 'WATCHING' });
		if (!process.env.DEV && process.env.DBL_API) {
			post(`https://discordbots.org/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.DBL_API } }).end();
			post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, { data: { server_count: client.guilds.size }, headers: { Authorization: process.env.DBOTS_API } }).end();
		}
	},
};