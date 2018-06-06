import { KlasaClient } from 'klasa';
import { ClientOptions } from 'discord.js';

export class Client extends KlasaClient {
	constructor(options: ClientOptions) {
		super({...options, ...{
			commandEditing: true,
			commandMessageLifetime: 3600,
			console: { timestamps: false, useColor: false },
			disabledCorePieces: ['commands'],
			prefix: 'h!',
			providers: { default: 'postgresql', postgresql: { connectionString: process.env.DATABASE } },
			readyMessage: c => c.user.tag
		}});
	}
}