import { ShardingManager, Shard } from 'discord.js';

// tslint:disable-next-line:no-floating-promises
new ShardingManager('./build/client.js', { token: process.env.TOKEN, execArgv: process.execArgv })
	.on('shardCreate', (shard: Shard) => console.log(`Launched shard ${shard.id}`))
	.spawn();