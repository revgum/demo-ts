import { DaprServer } from '@dapr/dapr';
import * as config from './config';
import { context } from './context';
import { routes as todoRoutes } from './handlers/todo';
import { create } from './models/todo';

async function start() {
  const server = new DaprServer({
    serverHost: config.server.host,
    serverPort: config.server.port,
    clientOptions: {
      daprHost: config.dapr.host,
      daprPort: config.dapr.port,
    },
  });

  for await (const route of Object.values(todoRoutes)) {
    await server.invoker.listen(route.methodName, (d) => route.fn(context, d), route.opts);
  }

  if (process.env.SEED_DATA) {
    const record = await create(context, {
      title: `Task ${new Date().toISOString()}`,
      completed: false,
    });
    console.log(`Created new Todo model: ${JSON.stringify(record)}`);
  }

  await server.start();
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
