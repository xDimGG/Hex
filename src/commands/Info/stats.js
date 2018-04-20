const	{ Command, version: akairoVersion } = require('discord-akairo');
const	{ version: discordjsVersion } = require('discord.js');
const	{ cpuLoad, memoryUsage } = require('os-toolbox');
const	{ type, release, uptime, totalmem } = require('os');
const	{ execSync } = require('child_process');
const	{ basename } = require('path');

module.exports = class extends Command {
	constructor() {
		super(basename(__filename).split('.')[0], {
			aliases: [basename(__filename).split('.')[0], 'about', 'info', 'ping', 'bot'],
			clientPermissions: ['SEND_MESSAGES'],
			description: 'OS and Bot statistics',
		});
	}

	exec(message) {
		message.channel.send('Loading...').then(async m => {
			const usedMemory = await memoryUsage();

			m.edit(
				'= STATISTICS =\n' +
				'\n' +
				'Versions\n' +
				`• Discord.js     :: ${discordjsVersion}\n` +
				`• Akairo         :: ${akairoVersion}\n` +
				`• Node           :: ${process.version}\n` +
				`• NPM            :: ${String(execSync('npm -v')).replace('\n', '')}\n` +
				'\n' +
				'System\n' +
				`• Uptime         :: ${this.formatTime(uptime)}\n` +
				`• OS Type        :: ${String(type).replace('_', ' ')} v${release}\n` +
				`• CPU Usage      :: ${await cpuLoad()}%\n` +
				`• RAM Usage      :: ${usedMemory}% (${Math.round((usedMemory / 100) * totalmem() / 1024 / 1024)} MB / ${Math.round(totalmem() / 1024 / 1024)} MB)\n` +
				'\n' +
				'Bot\n' +
				`• Uptime         :: ${this.formatTime(process.uptime())}\n` +
				`• Heartbeat Ping :: ${Math.round(this.client.ping)}ms\n` +
				`• Message Ping   :: ${Math.round(m.createdTimestamp - message.createdTimestamp)}ms\n` +
				`• Bot RAM Usage  :: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024))} MB\n` +
				'\n' +
				'Bot Stats\n' +
				`• Guilds         :: ${this.formatNumbers(this.client.guilds.size)}\n` +
				`• Members        :: ${this.formatNumbers(this.client.guilds.reduce((a, b) => a + b.memberCount, 0))}\n` +
				`• Emojis         :: ${this.formatNumbers(this.client.emojis.size)}\n` +
				`• Categories     :: ${this.formatNumbers(this.client.channels.filter(channel => channel.type === 'category').size)}\n` +
				`• Text Channels  :: ${this.formatNumbers(this.client.channels.filter(channel => channel.type === 'text').size)}\n` +
				`• Voice Channels :: ${this.formatNumbers(this.client.channels.filter(channel => channel.type === 'voice').size)}`,
				{ code: 'asciidoc' }
			);
		});
	}

	formatTime(input) {
		const	days = Math.floor(input / 86400);
		const	hours = Math.floor((input % 86400) / 3600);
		const	minutes = Math.floor(((input % 86400) % 3600) / 60);
		const	seconds = Math.floor(((input % 86400) % 3600) % 60);

		return [
			days ? `${days}d` : '',
			hours ? `${hours}h` : '',
			minutes ? `${minutes}m` : '',
			seconds ? `${seconds}s` : '',
		].join(' ');
	}

	formatNumbers(input) {
		return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
};