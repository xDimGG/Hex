import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { Client, MessageAttachment, MessageEmbed, MessageOptions, StringResolvable, TextChannel } from 'discord.js';
import { format } from 'util';
import Database from './Database';
import Extensions from './Extensions';
const { DATABASE } = process.env;

Extensions();

export default class extends AkairoClient implements Client {
	public constructor() {
		super({ ownerID: '358558305997684739' }, {
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.database = new Database(DATABASE!);
		this.commandHandler = new CommandHandler(this, {
			automateCategories: true,
			directory: './src/commands',
			extensions: ['.ts'],
			handleEdits: true,
			prefix: async message => message.guild ? message.guild.prefix : 'h!',
		});
		this.listenerHandler = new ListenerHandler(this, {
			automateCategories: true,
			directory: './src/events',
			extensions: ['.ts'],
		});
	}

	public async error(data: any, ...args: any[]) {
		console.error(data, ...args);
		const channel = this.channels.get('361533828520476684') as TextChannel;
		if (!channel || channel.type !== 'text') throw new Error('Console channel either undefined or not a text channel');

		return channel.send(format(data, ...args), { code: 'js', split: { append: '```', prepend: '```js\n' } });
	}

	public async log(content?: StringResolvable, options?: MessageOptions | MessageEmbed | MessageAttachment) {
		const channel = this.channels.get('361533828520476684') as TextChannel;
		if (!channel || channel.type !== 'text') throw new Error('Console channel either undefined or not a text channel');

		return channel.send(content, options);
	}

	public async login(token?: string) {
		this.database.sync({ alter: true });

		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
		});
		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();

		return super.login(token);
	}
}