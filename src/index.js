const Client = require(`./structures/Client`);
new Client().start();

process.on(`uncaughtException`, error => {
	console.error(error.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`))
})

process.on(`unhandledRejection`, error => {
	console.error(error.stack.replace(new RegExp(`${__dirname}/`, `g`), `./`))
})
