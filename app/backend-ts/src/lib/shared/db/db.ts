import type { ServiceSecrets } from '@/lib/shared/types';
import Knex from 'knex';
import type { DbConfig } from './types';

export const buildKnexConfig = (serviceSecrets: ServiceSecrets, config: DbConfig) => ({
  client: 'pg',
  connection: {
    host: config.db.host,
    port: config.db.port,
    user: serviceSecrets.DB_USER,
    database: config.db.database,
    password: serviceSecrets.DB_PASSWORD,
    ssl: config.db.ssl,
  },
  pool: {
    min: 0,
    max: 10,
  },
  debug: config.db.debug,
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
  },
});

export const knex = (serviceSecrets: ServiceSecrets, config: DbConfig) =>
  Knex(buildKnexConfig(serviceSecrets, config));
