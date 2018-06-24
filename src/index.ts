import { ShardingManager } from 'discord.js';

// tslint:disable-next-line:no-floating-promises
new ShardingManager('./src/client.ts', { token: process.env.TOKEN })
	.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))
	.spawn();