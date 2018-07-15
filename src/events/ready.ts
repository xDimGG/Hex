import { MessageEmbed } from 'discord.js';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public async exec() {
		console.log(this.client.user.tag);
		if (!process.env.DEV) await this.client.log(new MessageEmbed()
			.setAuthor(this.client.user.tag, this.client.user.displayAvatarURL())
			.setTitle('Started'),
		);

		await this.client.user.setPresence({
			activity: {
				name: `${this.client.guilds.size} ${this.client.guilds.size === 0 ? 'Guild' : 'Guilds'}`,
				type: 'WATCHING',
				url: 'https://twitch.tv/monstercat',
			},
		});
	}
}