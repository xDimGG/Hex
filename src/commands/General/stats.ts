import { execSync } from 'child_process';
import { version as akairoVersion } from 'discord-akairo';
import { Message, version as discordVersion } from 'discord.js';
import Command from '../../structures/Extendables/Command';

export default class extends Command {
	public constructor() {
		super({
			description: 'Shows bot statistics',
		});
	}

	public async exec(message: Message) {
		const ramCommand = 'Math.round((process.memoryUsage().heapTotal / 1024 / 1024))';
		const runCommand = async (command: string) => (await runCommandReduce(command)).toLocaleString();
		const formatTime = (input: number) => {
			const days = Math.floor(input / 86400);
			const hours = Math.floor((input % 86400) / 3600);
			const minutes = Math.floor(((input % 86400) % 3600) / 60);
			const seconds = Math.floor(((input % 86400) % 3600) % 60);

			return [
				days ? `${days}d `  : '',
				hours ? `${hours}h ` : '',
				minutes ? `${minutes}m ` : '',
				seconds ? `${seconds}s` : '',
			].join('');
		};

		await message.channel.send([
			'= Versions =',
			`• Discord.js     :: ${discordVersion}`,
			`• Akairo         :: ${akairoVersion}`,
			`• Node           :: ${process.version}`,
			`• NPM            :: ${String(execSync('npm -v')).replace('\n', '')}`,
			'',
			`= Client Stats =`,
			`• Ping           :: ${Math.round(this.client.ping)}ms`,
			`• Uptime         :: ${formatTime(process.uptime())}`,
			`• RAM Usage      :: ${(await this.client.runCommand(ramCommand)).map(r => `${r} MB`).join('|')} (${(await this.client.runCommand(ramCommand)).reduce((a: number, b: number) => a + b, 0)} MB Total)`,
			`• Shard/Total    :: ${this.client.shard.id + 1}/${this.client.shard.count}`,
			'',
			'= User Statistics =',
			`• Cached Users   :: ${await runCommand('this.users.size')}`,
			`• Total Users    :: ${await runCommand('this.guilds.reduce((a, b) => a + b.memberCount, 0)')}`,
			`• Guilds         :: ${await runCommand('this.guilds.size')}`,
			`• Emojis         :: ${await runCommand('this.emojis.size')}`,
			`• Categories     :: ${await runCommand('this.channels.filter(channel => channel.type === "category").size')}`,
			`• Text Channels  :: ${await runCommand('this.channels.filter(channel => channel.type === "text").size')}`,
			`• Voice Channels :: ${await runCommand('this.channels.filter(channel => channel.type === "voice").size')}`,
		], { code: 'asciidoc' });
	}
}