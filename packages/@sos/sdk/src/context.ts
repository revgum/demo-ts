import pino from 'pino';
import { knex } from './db';
import { get } from './secrets';
import type { Context, ContextConfig, ServiceSecrets } from './types';

export const buildServiceContext = async <K>({
  dapr,
  db,
  env,
  runtime,
  secretsStore,
  server,
  serviceName,
}: ContextConfig<K>): Promise<Context<K>> => {
  let context = {
    env,
    serviceName,
    handlerName: 'unknown',
    handlerEndpoint: 'unknown',
    api: {
      version: '1.0',
      kind: 'unknown',
    },
    logger: pino({
      level: runtime.debug ? 'debug' : 'info',
    }),
    runtime,
    server,
    dapr,
  } as unknown as Context<K>;

  const serviceSecrets = await get<K, ServiceSecrets>({
    context,
    secretKey: secretsStore.key,
    secretStoreName: secretsStore.storeName,
  });

  context.db = knex(serviceSecrets, { db, secretsStore });

  return context;
};

export const buildHandlerContext = <K>(
  overrides: {
    apiKind: K;
    apiVersion?: string;
    handlerName: string;
    handlerEndpoint: string;
  },
  context: Context<K>,
): Context<K> => {
  return {
    ...context,
    handlerName: overrides.handlerName,
    handlerEndpoint: overrides.handlerEndpoint,
    api: {
      ...context.api,
      kind: overrides.apiKind,
      version: overrides.apiVersion || context.api.version,
    },
  };
};
