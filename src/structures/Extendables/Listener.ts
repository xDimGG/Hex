import { Listener, ListenerOptions } from 'discord-akairo';
import { parse } from 'path';

const name = (module: NodeModule) => {
	delete require.cache[module.filename];

	return parse(module.parent!.filename).name;
};

export default class extends Listener {
	public constructor(options: ListenerOptions) {
		super(name(module), { ...options, event: name(module) });
	}
}