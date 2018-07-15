import { MessageEmbed } from 'discord.js';
import Listener from '../structures/Extendables/Listener';

export default class extends Listener {
	public async exec() {
		console.log(this.client.user.tag);
	}
}