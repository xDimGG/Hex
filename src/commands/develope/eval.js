const { Command } = require(`discord-akairo`);
const { basename, sep } = require(`path`);
const { post } = require(`snekfetch`);
const { inspect } = require(`util`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			description: `Eval javascript code`,
			typing: true,
			hide: true,
			ownerOnly: true,
			args: [
				{
					id: `code`,
					type: `string`,
					match: `text`,
					prompt: {
						start: `What would you like to eval?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`
					}
				}
			]
		});
	}

	async exec(message, { code }) {
		const { client } = this; // eslint-disable-line no-unused-vars
		let content = await this.addToContent(code, `Input`, 0);
		try {
			let evaled = eval(code);

			if (evaled instanceof Promise) evaled = await evaled;
			if (evaled instanceof Object || evaled instanceof Function) evaled = inspect(evaled, { showHidden: true, showProxy: true, depth: 1 });

			content += await this.addToContent(evaled, `Output`, content.length);
		} catch (error) {
			content += await this.addToContent(error, `Error`, content.length);
		}
		message.channel.send(content);
		return undefined;
	}

	async addToContent(input, type, length) {
		return `${type === `Input` ? `📥` : type === `Output` ? `📤` : `❌`} ${type}\n${String(input).length < 1024 - length ? `\`\`\`js\n${this.clean(input)}\n\`\`\`\n` : `${await this.haste(this.clean(input))}.js`}`;
	}

	haste(input) {
		return post(`https://www.hastebin.com/documents`)
			.send(String(input))
			.end()
			.then(data => `https://www.hastebin.com/${data.body.key}`)
			.catch(error => `\`\`\`js\n${error}\n\`\`\`\n`);
	}

	clean(input) {
		const SECRET = `[SECRET!]`;
		if (typeof input !== `string`) { input = inspect(input, { depth: 0 }); }
		input = input
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`)
			.replace(process.env.Token, SECRET);

		for (const env in process.env) {
			if (env.includes(`_API`)) input = input.replace(process.env[env], SECRET);
		}
		return input;
	}
}

module.exports = This;
