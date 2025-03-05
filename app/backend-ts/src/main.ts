import { DaprServer, LogLevel } from '@dapr/dapr';
import express from 'express';
import { context } from './context';
import { create } from './models/todo';
import { DaprRouter } from './routers/dapr';
import { V1Router } from './routers/v1/router';

async function start() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/v1', V1Router(context));

  if (context.runtime.localhost) {
    app.use('/v1.0', DaprRouter);
  }

  const server = new DaprServer({
    serverHost: context.server.host,
    serverPort: context.server.port,
    serverHttp: app,
    clientOptions: {
      daprHost: context.dapr.host,
      daprPort: context.dapr.port,
    },
    logger: {
      level: context.runtime.debug ? LogLevel.Debug : LogLevel.Info,
    },
  });

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
