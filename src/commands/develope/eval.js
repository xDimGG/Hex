const { Command } = require(`discord-akairo`);
const { inspect } = require(`util`);
const { basename } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			ownerOnly: true,
			args: [
				{
					id: `code`,
					type: `string`
				}
			]
		});
	}

	async exec(message, { code }) {
		const { client } = this; // eslint-disable-line no-unused-vars
		let content = await this.addToContent(code, `Input`);
		try {
			let evaled = eval(code);

			if (evaled instanceof Promise) evaled = await evaled;
			if (evaled instanceof Object || evaled instanceof Function) evaled = inspect(evaled, { showHidden: true, showProxy: true, depth: 1 });

			content += await this.addToContent(evaled, `Output`);
		} catch (error) {
			content += await this.addToContent(error, `Error`);
		}
		message.channel.send(content);
		return undefined;
	}

	async addToContent(input, type) {
		return `${type === `Input` ? `📥` : type === `Output` ? `📤` : `❌`} ${type}\n${String(input).length < 1024 ? `\`\`\`js\n${input}\n\`\`\`\n` : `${await this.client.haste(input)}.js`}`;
	}
}

module.exports = This;
