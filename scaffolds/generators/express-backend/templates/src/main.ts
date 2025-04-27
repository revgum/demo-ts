import 'dotenv/config';

import {
  createTodo,
  deleteTodoById,
  getAllTodo,
  getTodoById,
  updateTodoById,
} from '@/handlers/todo';
import { context } from '@/lib/context';
import { buildOpenApiSpec } from '@/lib/openapi';
import { loadSeedData } from '@/lib/seed';
import { buildDaprClient, buildDaprServer } from '@/lib/shared/dapr';
import express from 'express';
import {
  DependsOnMethod,
  type Routing,
  ServeStatic,
  createConfig,
  createServer,
} from 'express-zod-api';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import pino from 'pino';
import ui from 'swagger-ui-express';
import { handleTodo } from './handlers/todo-consumer';

const serverConfig = createConfig({
  startupLogo: false,
  http: {
    // Dynamic socket listener, application port is managed by daprServer
    listen: `/tmp/express-${randomUUID()}.sock`,
  },
  cors: true,
  compression: true,
  logger: pino({
    level: context.runtime.debug ? 'debug' : 'info',
  }),
  beforeRouting: ({ app }) => {
    // Support CloudEvent data from pubsub posted by Dapr
    app.use(express.json({ type: ['application/cloudevents+json', 'application/json'] }));
    app.use('/docs', ui.serve, ui.setup(null, { swaggerUrl: '/public/openapi.yaml' }));
  },
});

const serverRouting: Routing = {
  api: {
    v1: {
      todos: new DependsOnMethod({
        get: getAllTodo,
        post: createTodo,
      }).nest({
        ':id': new DependsOnMethod({
          get: getTodoById,
          put: updateTodoById,
          delete: deleteTodoById,
        }),
      }),
    },
  },
  consumer: {
    // Example endpoint for consuming pubsub topic data
    todo: handleTodo,
  },
  // path /public serves static files from /public
  public: new ServeStatic(join(__dirname, 'public'), {
    dotfiles: 'deny',
    index: false,
    redirect: false,
  }),
};

const startServer = async () => {
  if (process.env.SEED_DATA) {
    await loadSeedData(context);
  }
  await buildOpenApiSpec(serverRouting, serverConfig, context);

  buildDaprClient(context);

  const { app } = await createServer(serverConfig, serverRouting);
  const daprServer = buildDaprServer(context, app);

  await daprServer.start();
};

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
