import { DurableObject } from 'cloudflare:workers';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/code')) {
			const body = await request.json();

			const sessionId = body['session-id'];
			const id = env.CODE_EXECUTOR.idFromName(sessionId);
			const container = env.CODE_EXECUTOR.get(id);
			return container.executeCode(body['code']);
		}

		return env.ASSETS.fetch(request);
	},
};

export class CodeExecutor extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);

		// TODO: enable this once the container is up
		// ctx.blockConcurrencyWhile(ctx.container.start);
	}

	async executeCode(code) {
		// TODO: enable this once the container is up
		// return await this.ctx.container.getTcpPort(4567).fetch(...);

		return await fetch('http://localhost:4567/code', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ code }),
		});
	}
}
