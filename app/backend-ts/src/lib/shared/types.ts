import type { Knex } from 'knex';
import type { Logger } from 'pino';
import type { DbConfig } from './db';

export type Context<K> = {
  serviceName: string;
  handlerName: string;
  handlerEndpoint: string;
  env: 'development' | 'staging' | 'production';
  api: {
    version: string;
    kind: K;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: Knex<any, unknown[]>;
  logger: Logger;
  runtime: {
    debug: boolean;
    localhost: boolean;
  };
  server: {
    host: string;
    port: string;
  };
  dapr: {
    host: string;
    port: string;
  };
};

export type ContextConfig<K> = DbConfig &
  Pick<Context<K>, 'dapr' | 'env' | 'runtime' | 'server' | 'serviceName'>;

export type ServiceParams<T, K> = {
  context: Context<K>;
  logger: Logger;
  input?: T;
};

export type ServiceSecrets = {
  JWT_SECRET: string;
  DB_USER: string;
  DB_PASSWORD: string;
};

export type User = {
  id: string;
};
