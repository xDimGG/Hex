const { AkairoClient } = require(`discord-akairo`);
const { sep, resolve } = require(`path`);

const botName = String(resolve(`./`).split(sep).slice(-1));
const client = new AkairoClient({
	ownerID: `358558305997684739`,
	prefix: `${botName.toLowerCase().charAt(0)}!`,
	allowMention: true,
	commandDirectory: `./src/commands/`,
	inhibitorDirectory: `./src/inhibitors/`,
	listenerDirectory: `./src/listeners/`
});

client.temporary = [];

client.login(process.env.Token).then(() => console.log(client.user.tag));

process.on(`uncaughtException`, error => {
	console.error(error.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`));
	process.exit();
});

process.on(`unhandledRejection`, error => {
	console.error(error.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`));
});
