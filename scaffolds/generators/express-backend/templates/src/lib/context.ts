import { dapr, env, runtime, server } from '@/config';
import { knex } from '@/db/db';
import type { Context } from '@/lib/shared/types';
import type { ContextKind } from '@/types';
import pino from 'pino';

export const context: Context<ContextKind> = {
  env,
  api: {
    version: '1.0',
    kind: 'unknown',
  },
  db: knex(env),
  logger: pino({
    level: runtime.debug ? 'debug' : 'info',
  }),
  runtime,
  server,
  dapr,
};
