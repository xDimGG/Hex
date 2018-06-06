import { Configuration, Language, Command, KlasaTextChannel } from 'klasa';
import { Snowflake, User } from 'discord.js';

export class clientStorageSchema extends Configuration {
	public userBlacklist: User[];
	public guildBlacklist: string[];
	public schedules: any[];
}

export class guildSchema extends Configuration {
	public prefix: string;
	public language: Language;
	public disableNaturalPrefix: boolean;
	public diabledCommands: Command[];
}

export class userSchema extends Configuration {}