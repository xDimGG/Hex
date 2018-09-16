import { Shard, ShardingManager } from 'discord.js';
import Server from './structures/Server';

new Server()
	.on('ready', port => console.log(`Launched server on port: ${port}`))
	.spawn();

new ShardingManager('./src/structures/Client.ts', { token: process.env.TOKEN, execArgv: process.execArgv })
	.on('shardCreate', (shard: Shard) => console.log(`Launched shard ${shard.id}`))
	.spawn();