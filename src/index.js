import { DurableObject } from "cloudflare:workers";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/code")) {
      const { code, "session-id": sessionId } = await request.json();
      const id = env.CODE_EXECUTOR.idFromName(sessionId);
      return env.CODE_EXECUTOR.get(id).execute(code);
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

  async execute(code) {
    // TODO: enable this once the container is up
    // return await this.ctx.container.getTcpPort(4567).fetch(...);

    return await fetch("http://localhost:4567/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
  }
}
