import { AkairoModuleOptions, Listener } from 'discord-akairo';
import { EventEmitter } from 'events';
import { parse } from 'path';

const name = (module: NodeModule) => {
	delete require.cache[module.filename];

	return parse(module.parent!.filename).name;
};

export default class extends Listener {
	public constructor(options: {
		emitter: string | EventEmitter;
		type?: string;
	} & AkairoModuleOptions) {
		super(name(module), { ...options, event: name(module) });
	}
}