const { Listener } = require('discord-akairo');
const { parse } = require('path');

function name(mod) {
	delete require.cache[mod.filename];

	return parse(mod.parent.filename).name;
}

module.exports = class extends Listener {
	constructor(options) {
		super(name(module), Object.assign({ event: name(module) }, options));
	}
};