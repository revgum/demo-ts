import { dapr, env, runtime, server } from './config';
import { knex } from './db/db';
import type { Context } from './types';

export const context: Context = {
  env,
  db: knex(env),
  runtime,
  server,
  dapr,
};
