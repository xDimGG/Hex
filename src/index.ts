import Client from './structures/Client';

// tslint:disable-next-line no-floating-promises
new Client().login(process.env.TOKEN);