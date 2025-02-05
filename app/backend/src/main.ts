import { DaprServer, HttpMethod } from "@dapr/dapr";
import * as config from "./config";
import { randomUUID } from "node:crypto";
import { handleInvocation } from "./hello";
import { context } from "./context";

async function start() {
	const server = new DaprServer({
		serverHost: config.server.host,
		serverPort: config.server.port,
		clientOptions: {
			daprHost: config.dapr.host,
			daprPort: config.dapr.port,
		},
	});

	await server.invoker.listen(
		"hello-world",
		(data) => handleInvocation(context, data),
		{
			method: HttpMethod.GET,
		},
	);

	// Add a row every time we boot, for fun
	await context
		.db("test")
		.insert({ field1: randomUUID(), created_at: new Date() });

	await server.start();
}

start().catch((e) => {
	console.error(e);
	process.exit(1);
});
