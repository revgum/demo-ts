import { knex } from '@/lib/shared/db';
import { get } from '@/lib/shared/secrets';
import type { Context, ContextConfig, ServiceSecrets } from '@/lib/shared/types';
import { ContextKinds, type ContextKind } from '@/types';
import pino from 'pino';

export const buildServiceContext = async ({
  dapr,
  db,
  env,
  runtime,
  secretsStore,
  server,
  serviceName,
}: ContextConfig<ContextKind>): Promise<Context<ContextKind>> => {
  let context = {
    env,
    serviceName,
    handlerName: 'unknown',
    handlerEndpoint: 'unknown',
    api: {
      version: '1.0',
      kind: ContextKinds.UNKNOWN,
    },
    logger: pino({
      level: runtime.debug ? 'debug' : 'info',
    }),
    runtime,
    server,
    dapr,
  } as unknown as Context<ContextKind>;

  const serviceSecrets = await get<ContextKind, ServiceSecrets>({
    context,
    secretKey: secretsStore.key,
    secretStoreName: secretsStore.storeName,
  });

  context.db = knex(serviceSecrets, { db, secretsStore });

  return context;
};

export const buildHandlerContext = (
  overrides: {
    apiKind: ContextKind;
    apiVersion?: string;
    handlerName: string;
    handlerEndpoint: string;
  },
  context: Context<ContextKind>,
): Context<ContextKind> => {
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
