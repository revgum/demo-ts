import { dapr, env, runtime, server, serviceName } from '@/config';
import { knex } from '@/db/db';
import type { Context } from '@/lib/shared/types';
import type { ContextKind } from '@/types';
import pino from 'pino';

export const context: Context<ContextKind> = {
  env,
  serviceName,
  handlerName: 'unknown',
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

export const buildHandlerContext = <K>(overrides: {
  kind: K;
  handlerName: string;
}): Context<K> => ({
  ...context,
  handlerName: overrides.handlerName,
  api: {
    ...context.api,
    kind: overrides.kind,
  },
});
