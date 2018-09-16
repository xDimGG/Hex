import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Client } from 'discord.js';
import Database from './Database';
import Extensions from './Extensions';

const { DATABASE } = process.env;
if (!DATABASE) throw new Error('Database not provided');

Extensions();

export default class CustomClient extends AkairoClient implements Client {
	public constructor() {
		super({ ownerID: '358558305997684739' }, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
			messageCacheLifetime: 60,
			messageCacheMaxSize: Infinity,
			messageSweepInterval: 60,
		});

		this.database = new Database(DATABASE!);
		this.commandHandler = new CommandHandler(this, {
			automateCategories: true,
			commandUtil: true,
			commandUtilLifetime: 60,
			directory: './src/commands',
			handleEdits: true,
			prefix: async message => message.guild ? message.guild.prefix : 'h!',
		});
		this.listenerHandler = new ListenerHandler(this, {
			automateCategories: true,
			directory: './src/events',
		});
	}

	public async login(token?: string) {
		await this.database.sync({ alter: true });

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();

		return super.login(token);
	}

	public async runCommand(command: string) {
		return this.shard.broadcastEval(command);
	}
}

new CustomClient().login(process.env.TOKEN);