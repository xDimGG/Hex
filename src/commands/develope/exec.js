const { Command } = require(`discord-akairo`);
const { exec } = require(`child_process`);
const { post } = require(`snekfetch`);
const { basename } = require(`path`);

class This extends Command {
	constructor() {
		super(basename(__filename).split(`.`)[0], {
			aliases: [basename(__filename).split(`.`)[0]],
			ownerOnly: true,
			args: [
				{
					id: `code`,
					type: `string`,
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
		return true;
	}

	async addToContent(input, type, length) {
		return `${type === `Input` ? `📥` : type === `Output` ? `📤` : `❌`} ${type}\n${String(input).length < 1024 - length ? `\`\`\`js\n${input}\n\`\`\`\n` : `${await this.haste(input)}.js`}`;
	}

	haste(input) {
		return post(`https://www.hastebin.com/documents`)
			.send(String(input))
			.end()
			.then(data => `https://www.hastebin.com/${data.body.key}`)
			.catch(error => `\`\`\`js\n${error}\n\`\`\`\n`);
	}
}

module.exports = This;
