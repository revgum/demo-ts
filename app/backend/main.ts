import {
	DaprServer,
	HttpMethod,
	type DaprInvokerCallbackContent,
} from "@dapr/dapr";

const daprHost = process.env.DAPR_HOST || "127.0.0.1";
const daprPort = process.env.DAPR_PORT || "3500";
const serverHost = process.env.SERVER_HOST || "127.0.0.1";
const serverPort = process.env.SERVER_PORT || "3001";

async function start() {
	const server = new DaprServer({
		serverHost,
		serverPort,
		clientOptions: {
			daprHost,
			daprPort,
		},
	});

	const callbackFunction = (
		data: DaprInvokerCallbackContent,
	): Promise<void> => {
		console.log("Received body: ", data.body);
		console.log("Received metadata: ", data.metadata);
		console.log("Received query: ", data.query);
		console.log("Received headers: ", data.headers); // only available in HTTP
		return;
	};

	await server.invoker.listen("hello-world", callbackFunction, {
		method: HttpMethod.GET,
	});

	// You can now invoke the service with your app id and method "hello-world"

	await server.start();
}

start().catch((e) => {
	console.error(e);
	process.exit(1);
});
