const { Command } = require(`discord-akairo`);
const { exec } = require(`child_process`);
const { basename, sep } = require(`path`);
const { post } = require(`snekfetch`);
const { inspect } = require(`util`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			category: String(basename(__dirname).split(sep).slice(-1)),
			description: `Exec linux commands`,
			typing: true,
			hide: true,
			ownerOnly: true,
			args: [
				{
					id: `code`,
					type: `string`,
					match: `text`,
					prompt: {
						start: `What would you like to exec?`,
						timeout: `You did not respond in time`,
						ended: `You did not respond with a valid response, Please re-run the command`,
						cancel: `Command canceled`
					}
				}
			]
		});
	}

	async exec(message, { code }) {
		let content = await this.addToContent(this.client, code, `Input`, 0);
		exec(code, { cwd: `../../../../` }, async (error, stdout, stderr) => {
			if (stderr) {
				content += await this.addToContent(this.client, stderr, `Error`, content.length);
			} else if (error) {
				content += await this.addToContent(this.client, error, `Error`, content.length);
			} else {
				content += await this.addToContent(this.client, stdout, `Output`, content.length);
			}
			message.channel.send(content);
		});
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
