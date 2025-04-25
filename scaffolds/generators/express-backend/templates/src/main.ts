import 'dotenv/config';

import { join } from 'node:path';
import { context } from '@/context';
import {
  createTodo,
  deleteTodoById,
  getAllTodo,
  getTodoById,
  updateTodoById,
} from '@/handlers/todo';
import { buildOpenApiSpec } from '@/openapi';
import { loadSeedData } from '@/seed';
import {
  DependsOnMethod,
  type Routing,
  ServeStatic,
  createConfig,
  createServer,
} from 'express-zod-api';
import pino from 'pino';
import ui from 'swagger-ui-express';

const serverConfig = createConfig({
  startupLogo: false,
  http: {
    listen: {
      port: Number.parseInt(context.server.port),
      host: context.server.host,
    },
  },
  cors: true,
  compression: true,
  logger: pino({
    level: context.runtime.debug ? 'debug' : 'info',
  }),
  beforeRouting: ({ app }) => {
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
  await createServer(serverConfig, serverRouting);
};

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
