import 'dotenv/config';

import * as TodoApiHandlers from '@/handlers/api/todo';
import * as TodoConsumer from '@/handlers/consumer/todo-consumer';
import { context } from '@/lib/context';
import { buildOpenApiSpec } from '@/lib/openapi';
import { loadSeedData } from '@/lib/seed';
import { buildDaprClient, buildDaprServer } from '@/lib/shared/dapr';
import type { ContextKind } from '@/types';
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
import ui from 'swagger-ui-express';

const serverConfig = createConfig({
  startupLogo: false,
  http: {
    // Dynamic socket listener, application port is managed by daprServer
    listen: `/tmp/express-${randomUUID()}.sock`,
  },
  cors: true,
  compression: true,
  logger: context.logger,
  beforeRouting: ({ app }) => {
    // Parse JSON to support CloudEvents data being posted by Dapr PubSub subscriptions to Consumer endpoints
    app.use(express.json({ type: ['application/cloudevents+json', 'application/json'] }));
    // Route /docs to a SwaggerUI endpoint for improved developer experience
    app.use('/docs', ui.serve, ui.setup(null, { swaggerUrl: '/public/openapi.yaml' }));
  },
});

const serverRouting: Routing = {
  api: {
    v1: {
      todos: new DependsOnMethod({
        get: TodoApiHandlers.getAllTodo,
        post: TodoApiHandlers.createTodo,
      }).nest({
        ':id': new DependsOnMethod({
          get: TodoApiHandlers.getTodoById,
          put: TodoApiHandlers.updateTodoById,
          delete: TodoApiHandlers.deleteTodoById,
        }),
      }),
    },
  },
  consumer: {
    // Example endpoint for consuming a Dapr PubSub subscription
    todo: TodoConsumer.handleMessage,
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
  buildDaprClient<ContextKind>(context);

  const { app } = await createServer(serverConfig, serverRouting);
  const daprServer = buildDaprServer<ContextKind>(context, app);
  await daprServer.start();
};

startServer().catch((e) => {
  context.logger.error(e);
  process.exit(1);
});
