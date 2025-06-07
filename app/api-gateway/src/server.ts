import * as serviceConfig from '@/config';
import * as TodoApiHandlers from '@/handlers/api/todo';
import { buildOpenApiSpec } from '@/lib/openapi';
import type { ContextKind } from '@/types';
import { Api, Dapr, buildServiceContext, type Context } from '@sos/sdk';
import express from 'express';
import {
  DependsOnMethod,
  ServeStatic,
  createConfig,
  createServer,
  type Routing,
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
    cors: ({ defaultHeaders }) => ({
      ...defaultHeaders,
      'Access-Control-Allow-Headers': 'authorization,content-type',
    }),
    compression: true,
    logger: context.logger,
    errorHandler: Api.defaultErrorHandler,
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
        }),
        /*
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
        */
      },
    },
    // path /public serves static files from /public
    public: new ServeStatic(join(__dirname, 'public'), {
      dotfiles: 'deny',
      index: false,
      redirect: false,
    }),
  }) as Routing;

export const buildServer = async () => {
  const context = await buildServiceContext<ContextKind>(serviceConfig);

  const config = serverConfig(context);
  const serverRoutes = serverRouting(context);

  await buildOpenApiSpec(serverRoutes, config, context);
  Dapr.buildDaprClient<ContextKind>(context);

  const server = await createServer(config, serverRoutes);
  return { server, context };
};
