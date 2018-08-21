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
		const getShard = async (command: string) => (await this.client.shard.broadcastEval(command)).reduce((a: number, b: number) => a + b, 0).toLocaleString();
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
			`• RAM Usage      :: ${(await this.client.shard.broadcastEval('Math.round((process.memoryUsage().heapTotal / 1024 / 1024))')).map(r => r + ' MB').join(' | ')}`,
			`• Shard/Total    :: ${this.client.shard.id + 1}/${this.client.shard.count}`,
			'',
			'= User Statistics (All Shards) =',
			`• Cached Users   :: ${await getShard('this.users.size')}`,
			`• Total Users    :: ${await getShard('this.guilds.reduce((a, b) => a + b.memberCount, 0)')}`,
			`• Guilds         :: ${await getShard('this.guilds.size')}`,
			`• Emojis         :: ${await getShard('this.emojis.size')}`,
			`• Categories     :: ${await getShard('this.channels.filter(channel => channel.type === "category").size')}`,
			`• Text Channels  :: ${await getShard('this.channels.filter(channel => channel.type === "text").size')}`,
			`• Voice Channels :: ${await getShard('this.channels.filter(channel => channel.type === "voice").size')}`,
		], { code: 'asciidoc' });
	}
}