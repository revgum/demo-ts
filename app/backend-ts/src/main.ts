import * as serviceConfig from '@/config';
import * as TodoApiHandlers from '@/handlers/api/todo';
import * as TodoConsumer from '@/handlers/consumer/todo-consumer';
import { buildOpenApiSpec } from '@/lib/openapi';
import { loadSeedData } from '@/lib/seed';
import { buildServiceContext } from '@/lib/shared/context';
import { buildDaprClient, buildDaprServer } from '@/lib/shared/dapr';
import type { Context } from '@/lib/shared/types';
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

const serverConfig = (context: Context<ContextKind>) =>
  createConfig({
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

const serverRouting = (context: Context<ContextKind>) =>
  ({
    api: {
      v1: {
        todos: new DependsOnMethod({
          // GET: /api/v1/todos
          get: TodoApiHandlers.getAllTodo(context),
          // POST: /api/v1/todos
          post: TodoApiHandlers.createTodo(context),
        }).nest({
          ':id': new DependsOnMethod({
            // GET: /api/v1/todos/{id}
            get: TodoApiHandlers.getTodoById(context),
            // PUT: /api/v1/todos/{id}
            put: TodoApiHandlers.updateTodoById(context),
            // PATCH : /api/v1/todos/{id}
            patch: TodoApiHandlers.updateTodoById(context),
            // DELETE: /api/v1/todos/{id}
            delete: TodoApiHandlers.deleteTodoById(context),
          }),
        }),
      },
    },
    consumer: {
      // Example endpoint for consuming a Dapr PubSub subscription
      // POST: /consumer/todo
      todo: TodoConsumer.handleMessage(context),
    },
    // path /public serves static files from /public
    public: new ServeStatic(join(__dirname, 'public'), {
      dotfiles: 'deny',
      index: false,
      redirect: false,
    }),
  }) as Routing;

const startServer = async () => {
  const context = await buildServiceContext(serviceConfig);
  const config = serverConfig(context);
  const serverRoutes = serverRouting(context);

  if (process.env.SEED_DATA) {
    await loadSeedData(context);
  }

  await buildOpenApiSpec(serverRoutes, config, context);
  buildDaprClient<ContextKind>(context);

  const { app } = await createServer(config, serverRoutes);
  const daprServer = buildDaprServer<ContextKind>(context, app);
  await daprServer.start();
};

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
