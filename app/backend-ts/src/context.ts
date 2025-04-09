import { dapr, env, runtime, server } from '@/config';
import { knex } from '@/db/db';
import type { Context } from '@/types';

export const context: Context = {
  env,
  api: {
    version: '1.0',
    kind: 'unknown',
  },
  db: knex(env),
  runtime,
  server,
  dapr,
};
