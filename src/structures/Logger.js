const { post } = require('snekfetch');

module.exports = {
	debug(...content) {
		if (content instanceof Array) content = content.join(' ');
		process.log(content);
		if (process.env.DEV) return;
		post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_CONSOLE}`,
			{
				data: { avatar_url: 'https://shaybox.com/assets/images/states/grey.png', content, username: 'Debug' },
				headers: { 'Content-Type': 'application/json' },
			}).end();
	},
	error(...content) {
		if (content instanceof Array) content = content.join(' ');
		process.log(content);
		if (process.env.DEV) return;
		post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_CONSOLE}`,
			{
				data: { avatar_url: 'https://shaybox.com/assets/images/states/red.png', content, username: 'Error' },
				headers: { 'Content-Type': 'application/json' },
			}).end();
	},
	info(...content) {
		if (content instanceof Array) content = content.join(' ');
		process.log(content);
		if (process.env.DEV) return;
		post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_CONSOLE}`,
			{
				data: { avatar_url: 'https://shaybox.com/assets/images/states/green.png', content, username: 'Info' },
				headers: { 'Content-Type': 'application/json' },
			}).end();
	},
	log(...content) {
		if (content instanceof Array) content = content.join(' ');
		process.log(content);
		if (process.env.DEV) return;
		post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_CONSOLE}`,
			{
				data: { avatar_url: 'https://shaybox.com/assets/images/states/green.png', content, username: 'Log' },
				headers: { 'Content-Type': 'application/json' },
			}).end();
	},
	warn(...content) {
		if (content instanceof Array) content = content.join(' ');
		process.log(content);
		if (process.env.DEV) return;
		post(`https://discordapp.com/api/webhooks/${process.env.WEBHOOK_CONSOLE}`,
			{
				data: { avatar_url: 'https://shaybox.com/assets/images/states/red.png', content, username: 'Warn' },
				headers: { 'Content-Type': 'application/json' },
			}).end();
	},
};