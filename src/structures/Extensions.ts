import { Structures } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

export default () => {
	readdirSync(join(__dirname, './Extensions'))
		.forEach(file => {
			const extension = require(join(__dirname, `./Extensions/${file}`));
			Structures.extend(file.split('.')[0], extension.default);
		});
};