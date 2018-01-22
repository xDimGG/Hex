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

client.log = input => {
	console.log(input);
	if (process.env.DEV) return;
	client.guilds.get(`361532026354139156`).channels.find(`name`, `console`).send(new MessageEmbed()
		.setDescription(`\`\`\`\n${input}\n\`\`\``)
		.setColor(0x00FF00)
	);
};

client.warn = input => {
	console.warn(input);
	if (process.env.DEV) return;
	client.guilds.get(`361532026354139156`).channels.find(`name`, `console`).send(new MessageEmbed()
		.setDescription(`\`\`\`\n${input}\n\`\`\``)
		.setColor(0xFFFF00)
	);
};

client.error = input => {
	console.error(input);
	if (process.env.DEV) return;
	client.guilds.get(`361532026354139156`).channels.find(`name`, `console`).send(new MessageEmbed()
		.setDescription(`\`\`\`\n${input}\n\`\`\``)
		.setColor(0xFF0000)
	);
};

client.login(process.env.Token).then(() => console.log(client.user.tag));
