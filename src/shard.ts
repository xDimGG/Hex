import { ShardingManager } from 'discord.js';

const manager = new ShardingManager('./build/index.js', { token: process.env.TOKEN });

// tslint:disable-next-line:no-floating-promises
manager.spawn();
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));