import { Client } from './structures/Client';

// tslint:disable-next-line:no-floating-promises
new Client({
	disabledEvents: ['TYPING_START'],
	disableEveryone: true,
	messageCacheLifetime: 3600,
	messageCacheMaxSize: -1,
	messageSweepInterval: 3600,
	presence: {
		activity: {
			type: 'WATCHING',
			name: 'for @Hex help'
		}
	}
}).login(process.env.TOKEN || '');