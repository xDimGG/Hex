const { Command, version: akairoVersion } = require('discord-akairo');
const { version: discordjsVersion } = require('discord.js');
const { cpuLoad, memoryUsage } = require('os-toolbox');
const { type, release, uptime, totalmem } = require('os');
const { execSync } = require('child_process');

module.exports = class extends Command {
	constructor() {
		super({
			aliases: [require('path').parse(__filename).name, 'about', 'info', 'ping', 'bot'],
			clientPermissions: ['SEND_MESSAGES'],
			description: 'OS and Bot statistics',
		});
	}

	exec(message) {
		message.channel.send('Loading...').then(async m => {
			const usedMemory = await memoryUsage();

			m.edit([
				'= STATISTICS =',
				'',
				'Versions',
				`• Discord.js     :: ${discordjsVersion}`,
				`• Akairo         :: ${akairoVersion}`,
				`• Node           :: ${process.version}`,
				`• NPM            :: ${String(execSync('npm -v')).replace('\n', '')}`,
				'',
				'System',
				`• Uptime         :: ${this.formatTime(uptime)}`,
				`• OS Type        :: ${String(type).replace('_', ' ')} v${release}`,
				`• CPU Usage      :: ${await cpuLoad()}%`,
				`• RAM Usage      :: ${usedMemory}% (${Math.round((usedMemory / 100) * totalmem() / 1024 / 1024)} MB / ${Math.round(totalmem() / 1024 / 1024)} MB)`,
				'',
				'Bot',
				`• Uptime         :: ${this.formatTime(process.uptime())}`,
				`• Heartbeat Ping :: ${Math.round(this.client.ping)}ms`,
				`• Message Ping   :: ${Math.round(m.createdTimestamp - message.createdTimestamp)}ms`,
				`• Bot RAM Usage  :: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024))} MB`,
				'',
				'Bot Stats',
				`• Guilds         :: ${this.client.guilds.size.toLocaleString()}`,
				`• Members        :: ${this.client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
				`• Emojis         :: ${this.client.emojis.size.toLocaleString()}`,
				`• Categories     :: ${this.client.channels.filter(channel => channel.type === 'category').size.toLocaleString()}`,
				`• Text Channels  :: ${this.client.channels.filter(channel => channel.type === 'text').size.toLocaleString()}`,
				`• Voice Channels :: ${this.client.channels.filter(channel => channel.type === 'voice').size.toLocaleString()}`,
			], { code: 'asciidoc' });
		});
	}

	formatTime(input) {
		const days = Math.floor(input / 86400);
		const hours = Math.floor((input % 86400) / 3600);
		const minutes = Math.floor(((input % 86400) % 3600) / 60);
		const seconds = Math.floor(((input % 86400) % 3600) % 60);

		return [
			days ? `${days}d ` : '',
			hours ? `${hours}h ` : '',
			minutes ? `${minutes}m ` : '',
			seconds ? `${seconds}s ` : '',
		].join('');
	}
};