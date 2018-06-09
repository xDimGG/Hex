import { Command, KlasaClient, CommandStore, KlasaMessage, util, Stopwatch, Type, KlasaTextChannel } from 'klasa';
import { inspect } from 'util';

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], core: boolean) {
		super(client, store, file, core, {
			aliases: ['ev'],
			permissionLevel: 10,
			description: (message) => message.language.get('COMMAND_EVAL_DESCRIPTION'),
			extendedHelp: (message) => message.language.get('COMMAND_EVAL_EXTENDEDHELP'),
			usage: '<expression:str>',
		});
	}

	async run(message: KlasaMessage, [code]: string[]) {
		const { success, result, time, type } = await this.eval(message, code);
		const footer = util.codeBlock('ts', type);
		const output = message.language.get(success ? 'COMMAND_EVAL_OUTPUT' : 'COMMAND_EVAL_ERROR', time, util.codeBlock('js', result), footer);

		if ('silent' in message.flags) return message;

		if (output.length > 2000 && message.guild && (message.channel as KlasaTextChannel).attachable) {
			return message.send(message.language.get('COMMAND_EVAL_SENDFILE', time, footer), {
				files: [{
					attachment: Buffer.from(result),
					name: 'output.txt',
				}],
			});
		}

		return message.send(output);
	}

	async eval(message: KlasaMessage, code: string) {
		const { flags } = message;
		const stopwatch = new Stopwatch();
		let success, syncTime, asyncTime, result;
		let thenable = false;
		let type;
		try {
			if (flags.async) code = `(async () => {\n${code}\n})();`;
			result = eval(code);
			syncTime = stopwatch.toString();
			type = new Type(result);
			if (util.isThenable(result)) {
				thenable = true;
				stopwatch.restart();
				result = await result;
				asyncTime = stopwatch.toString();
			}
			success = true;
		} catch (error) {
			if (!syncTime) syncTime = stopwatch.toString();
			if (!type) type = new Type(error);
			if (thenable && !asyncTime) asyncTime = stopwatch.toString();
			result = error;
			success = false;
		}

		stopwatch.stop();
		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: flags.depth ? parseInt(flags.depth) || 0 : 0,
				showHidden: Boolean(flags.showHidden),
			});
		}

		return { success, type, time: this.formatTime(syncTime, asyncTime), result: util.clean(result) };
	}

	formatTime(syncTime: string, asyncTime = '') {
		return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
	}
}

