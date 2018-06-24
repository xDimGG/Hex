import { Configuration, Language, Command, KlasaTextChannel } from 'klasa';
import { Snowflake, User } from 'discord.js';

export class ClientSchema extends Configuration {
	public userBlacklist: User[];
	public guildBlacklist: string[];
	public schedules: any[];
}

export class GuildSchema extends Configuration {
	public prefix: string;
	public language: Language;
	public disableNaturalPrefix: boolean;
	public diabledCommands: Command[];
	public hexrole: Snowflake;
}

export class UserSchema extends Configuration {}