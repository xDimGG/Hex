import { Command, CommandOptions } from 'discord-akairo';
import { parse } from 'path';

const name = (module: NodeModule) => {
	delete require.cache[module.filename];

	return parse(module.parent!.filename).name;
};

export default class extends Command {
	public constructor(options: CommandOptions) {
		super(name(module), { ...options, aliases: [name(module)] });
	}
}