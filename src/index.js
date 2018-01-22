const { AkairoClient } = require(`discord-akairo`);
const { MessageEmbed } = require(`discord.js`);
const { sep, resolve } = require(`path`);

const botName = String(resolve(`./`).split(sep).slice(-1));
const client = new AkairoClient({
	ownerID: `358558305997684739`,
	botName,
	prefix: `${botName.toLowerCase().charAt(0)}!`,
	allowMention: true,
	emitters: { process },
	commandDirectory: `./src/commands/`,
	inhibitorDirectory: `./src/inhibitors/`,
	listenerDirectory: `./src/listeners/`
});

client.console = (input, type) => {
	client.guilds.get(`361532026354139156`).channels.find(`name`, `console`).send(new MessageEmbed()
		.setDescription(`\`\`\`\n${input}\n\`\`\``)
		.setColor(type === `Log` ? 0x00FF00 : 0xFF0000)
		.setFooter(`${type}`)
		.setTimestamp()
	);
};

client.log = input => {
	console.log(input);
	if (!process.env.DEV) client.console(input, `Log`);
};

client.warn = input => {
	console.warn(input);
	if (!process.env.DEV) client.console(input, `Warn`);
};

client.error = input => {
	console.error(input);
	if (!process.env.DEV) client.console(input, `Error`);
};

client.login(process.env.Token).then(() => console.log(client.user.tag));
