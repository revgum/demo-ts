import type { DaprInvokerCallbackContent } from "@dapr/dapr";
import type { Context } from "./context";

export const handleInvocation = async (
	context: Context,
	data: DaprInvokerCallbackContent,
): Promise<{ rows: unknown[] }> => {
	console.log("Received body: ", data.body);
	console.log("Received metadata: ", data.metadata);
	console.log("Received query: ", data.query);
	console.log("Received headers: ", data.headers); // only available in HTTP
	const { rows } = await context.db.raw("select * from test;");
	return { rows };
};
