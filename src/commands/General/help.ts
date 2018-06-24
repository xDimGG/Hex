import { Command, KlasaClient, CommandStore, KlasaMessage, util } from 'klasa';
import { GuildSchema } from '../../typings';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			aliases: ['commands'],
			description: (message) => message.language.get('COMMAND_HELP_DESCRIPTION'),
			usage: '(Command:command)',
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;

			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	async run(message: KlasaMessage, [command]: [Command | undefined]) {
		if (command) {
			return message.send([
				`Name:        :: ${command.name}`,
				`Description: :: ${util.isFunction(command.description as (m: KlasaMessage) => string) ? (command.description as (m: KlasaMessage) => string)(message) : command.description}`,
				`Usage:       :: ${command.usage.fullUsage(message)}`,
				`More Info:   :: ${util.isFunction(command.extendedHelp as (m: KlasaMessage) => string) ? (command.extendedHelp as (m: KlasaMessage) => string)(message) : command.extendedHelp}`,
			], { code: 'asciidoc' });
		}

		const help: any = await this.buildHelp(message);
		const categories = Object.keys(help);
		const helpMessage = [];
		// tslint:disable-next-line:prefer-for-of
		for (let cat = 0; cat < categories.length; cat++) {
			helpMessage.push(`**${categories[cat]}**`, '```asciidoc');
			const subCategories = Object.keys(help[categories[cat]]);
			// tslint:disable-next-line:prefer-for-of
			for (let subCat = 0; subCat < subCategories.length; subCat++) helpMessage.push(`${help[categories[cat]][subCategories[subCat]].join('\n')}\n`);
			helpMessage.push('```');
		}

		return message.send(helpMessage, { split: { char: '\n' } });
	}

	async buildHelp(message: KlasaMessage) {
		const help: any = {};

		const commandNames = [...this.client.commands.keys()];
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

		await Promise.all(this.client.commands.map(async command =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					if (!help.hasOwnProperty(command.category)) help[command.category] = {};
					if (!help[command.category].hasOwnProperty(command.subCategory)) help[command.category][command.subCategory] = [];
					const description = typeof command.description === 'function' ? command.description(message) : command.description;
					help[command.category][command.subCategory].push(`${(message.guildConfigs as GuildSchema).prefix}${command.name.padEnd(longest)} :: ${description}`);
				})
				.catch(() => { })
		));

		return help;
	}

}
