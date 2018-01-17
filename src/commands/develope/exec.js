const { Command } = require(`discord-akairo`);
const { exec } = require(`child_process`);
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
		let content = await this.addToContent(this.client, code, `Input`);
		exec(code, { cwd: `../../../../` }, async (error, stdout, stderr) => {
			if (stderr) {
				content += await this.addToContent(this.client, stderr, `Error`);
			} else if (error) {
				content += await this.addToContent(this.client, error, `Error`);
			} else {
				content += await this.addToContent(this.client, stdout, `Output`);
			}
			message.channel.send(content);
		});
		return true;
	}

	async addToContent(input, type) {
		return `${type === `Input` ? `📥` : type === `Output` ? `📤` : `❌`} ${type}\n${String(input).length < 1024 ? `\`\`\`js\n${input}\n\`\`\`\n` : await this.client.haste(input)}`;
	}
}

module.exports = This;
