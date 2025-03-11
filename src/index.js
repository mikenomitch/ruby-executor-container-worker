import DurableObject from 'cloudflare:workers';

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const restaurantId = url.searchParams.get('restaurant-id');
		return env.CALL_AGENT.get(restaurantId).fetch(request);
	},
};

export class CodeExecutor extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);
		ctx.blockConcurrencyWhile(ctx.container.start);
	}

	async fetch(req) {
		return await this.ctx.container.getTcpPort(4567).fetch(req);
	}
}
