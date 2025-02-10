import { DaprServer } from '@dapr/dapr';
import * as config from './config';
import { context } from './context';
import { routes as testRoutes } from './handlers/test';
import { create } from './models/test';

async function start() {
  const server = new DaprServer({
    serverHost: config.server.host,
    serverPort: config.server.port,
    clientOptions: {
      daprHost: config.dapr.host,
      daprPort: config.dapr.port,
    },
  });

  for await (const route of Object.values(testRoutes)) {
    await server.invoker.listen(route.methodName, (d) => route.fn(context, d), route.opts);
  }

  if (process.env.SEED_DATA) {
    const record = await create(context, {});
    console.log(`Created new Test model: ${JSON.stringify(record)}`);
  }

  await server.start();
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
