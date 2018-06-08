import { Command, KlasaClient, CommandStore, KlasaMessage, version as klasaVersion } from 'klasa';
import { type, release, uptime, totalmem } from 'os';
import { cpuLoad, memoryUsage } from 'os-toolbox';
import { Message, version as discordVersion } from 'discord.js';
import { execSync } from 'child_process';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			aliases: ['statistics'],
			description: (message) => message.language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async run(message: KlasaMessage) {
		const m = await message.send('Loading...') as Message;
		const usedMemory = await memoryUsage();

		return message.send([
			'= Statistics =',
			'',
			'Versions',
			`• Discord.js     :: ${discordVersion}`,
			`• Klasa          :: ${klasaVersion}`,
			`• Node           :: ${process.version}`,
			`• NPM            :: ${String(execSync('npm -v')).replace('\n', '')}`,
			'',
			'System',
			`• Uptime         :: ${this.formatTime(uptime())}`,
			`• RAM Usage      :: ${usedMemory}% (${Math.round((usedMemory / 100) * totalmem() / 1024 / 1024)} MB / ${Math.round(totalmem() / 1024 / 1024)} MB)`,
			`• CPU Usage      :: ${await cpuLoad()}%`,
			`• OS Type        :: ${String(type).replace('_', ' ')} v${release}`,
			'',
			'Bot',
			`• Uptime         :: ${this.formatTime(process.uptime())}`,
			`• RAM Usage      :: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024))} MB`,
			`• Heartbeat Ping :: ${Math.round(this.client.ping)}ms`,
			`• Message Ping   :: ${Math.round(m.createdTimestamp - message.createdTimestamp)}ms`,
			'',
			'Shard Stats',
			`• Cached Users   :: ${this.client.users.size.toLocaleString()}`,
			`• Guilds         :: ${this.client.guilds.size.toLocaleString()}`,
			`• Members        :: ${this.client.guilds.reduce((a: number, b) => a + b.memberCount, 0).toLocaleString()}`,
			`• Emojis         :: ${this.client.emojis.size.toLocaleString()}`,
			`• Categories     :: ${this.client.channels.filter(channel => channel.type === 'category').size.toLocaleString()}`,
			`• Text Channels  :: ${this.client.channels.filter(channel => channel.type === 'text').size.toLocaleString()}`,
			`• Voice Channels :: ${this.client.channels.filter(channel => channel.type === 'voice').size.toLocaleString()}`,
		], { code: 'asciidoc' });
	}

	formatTime(input: number) {
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
}