import Knex from 'knex';
import type { ServiceSecrets } from '../types';
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
  searchPath: [config.db.schema],
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
    schemaName: config.db.schema,
  },
});

export const knex = (serviceSecrets: ServiceSecrets, config: DbConfig) =>
  Knex(buildKnexConfig(serviceSecrets, config));
