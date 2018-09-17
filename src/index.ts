import { Shard, ShardingManager } from 'discord.js';
import Server from './structures/Server';

const manager = new ShardingManager('./src/structures/Client.ts', { token: process.env.TOKEN, execArgv: process.execArgv })
	.on('shardCreate', (shard: Shard) => console.log(`Launched shard ${shard.id}`));

const server = new Server(manager)
	.on('ready', port => console.log(`Launched server on port: ${port}`));

[manager, server].forEach(c => c.spawn());