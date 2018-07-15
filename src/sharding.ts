import { Shard, ShardingManager } from 'discord.js';

// tslint:disable-next-line no-floating-promises
new ShardingManager('./src/index.ts', { token: process.env.TOKEN, execArgv: process.execArgv })
	.on('shardCreate', (shard: Shard) => console.log(`Launched shard ${shard.id}`))
	.spawn();