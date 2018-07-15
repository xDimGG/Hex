import { CommandHandler, ListenerHandler } from 'discord-akairo';
import { Guild } from 'discord.js';
import CustomClient from '../src/structures/Client';
import Database from '../src/structures/Database';

export interface GuildModel {
	createdAt: string;
	id: string;
	prefix: string;
	role: string;
	updatedAt: string;
}

declare module 'discord.js' {
	export interface Guild {
		database: Database;
		prefix: Promise<string> | string;
		getConfig(): Promise<GuildModel>;
		setConfig(data: object): Promise<GuildModel>;
	}

	export interface Client {
		commandHandler: CommandHandler;
		database: Database;
		listenerHandler: ListenerHandler;
		error(data?: any, ...args: any[]): Promise<Message | Message[]>;
		log(content?: StringResolvable, options?: MessageOptions | MessageEmbed | MessageAttachment): Promise<Message | Message[]>;
		log(options?: MessageOptions | MessageEmbed | MessageAttachment): Promise<Message | Message[]>;
	}
}