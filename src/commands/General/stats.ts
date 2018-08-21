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
		const getShard = async (command: string) => this.client.shard.broadcastEval(command);
		const getShardReduce = async (command: string) => (await getShard(command)).reduce((a: number, b: number) => a + b, 0);
		const getShardReduceLocale = async (command: string) => (await getShardReduce(command)).toLocaleString();
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
			`• RAM Usage      :: ${(await getShard(ramCommand)).map(r => `${r} MB`).join('|')} (${await getShardReduce(ramCommand)} MB Total)`,
			`• Shard/Total    :: ${this.client.shard.id + 1}/${this.client.shard.count}`,
			'',
			'= User Statistics =',
			`• Cached Users   :: ${getShardReduceLocale('this.users.size')}`,
			`• Total Users    :: ${getShardReduceLocale('this.guilds.reduce((a, b) => a + b.memberCount, 0)')}`,
			`• Guilds         :: ${getShardReduceLocale('this.guilds.size')}`,
			`• Emojis         :: ${getShardReduceLocale('this.emojis.size')}`,
			`• Categories     :: ${getShardReduceLocale('this.channels.filter(channel => channel.type === "category").size')}`,
			`• Text Channels  :: ${getShardReduceLocale('this.channels.filter(channel => channel.type === "text").size')}`,
			`• Voice Channels :: ${getShardReduceLocale('this.channels.filter(channel => channel.type === "voice").size')}`,
		], { code: 'asciidoc' });
	}
}