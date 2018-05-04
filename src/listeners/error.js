const Listener = require('../structures/Listener');
const { inspect } = require('util');

module.exports = class extends Listener {
	exec(error, message) {
		message.channel.send(['An unexpected error has occured', 'Please report this to my support server <https://discord.shaybox.com/>', `\`\`\`${inspect(error)}\`\`\``]);
	}
};