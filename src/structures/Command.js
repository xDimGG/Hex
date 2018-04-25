const { Command } = require('discord-akairo');
const { parse } = require('path');

function name(mod) {
	delete require.cache[mod.filename];

	return parse(mod.parent.filename).name;
}

module.exports = class extends Command {
	constructor(options) {
		super(name(module), options);
	}
};