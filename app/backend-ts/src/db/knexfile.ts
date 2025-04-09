import { db } from '@/config';
import type { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'pg',
  connection: {
    host: db.host,
    port: db.port,
    user: db.user,
    database: db.database,
    password: db.password,
    ssl: db.ssl,
  },
  pool: {
    min: 0,
    max: 10,
  },
  debug: db.debug,
  migrations: {
    tableName: 'knex_migrations',
    extension: 'ts',
  },
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...knexConfig,
  },
  staging: {
    ...knexConfig,
  },
  production: {
    ...knexConfig,
  },
};

module.exports = config;
export default config;
