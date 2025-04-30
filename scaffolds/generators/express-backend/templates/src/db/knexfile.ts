import { db, secretsStore } from '@/config';
import { buildServiceContext } from '@/lib/context';
import { get } from '@/lib/shared/secrets';
import type { ServiceSecrets } from '@/lib/shared/types';
import type { ContextKind } from '@/types';

export const buildKnexConfig = (serviceSecrets: ServiceSecrets) => ({
  client: 'pg',
  connection: {
    host: db.host,
    port: db.port,
    user: serviceSecrets.DB_USER,
    database: db.database,
    password: serviceSecrets.DB_PASSWORD,
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
});

async function buildConfigurationForEnv() {
  const context = await buildServiceContext();
  const serviceSecrets = await get<ContextKind, ServiceSecrets>({
    context,
    secretKey: secretsStore.key,
    secretStoreName: secretsStore.storeName,
  });

  return {
    [context.env]: buildKnexConfig(serviceSecrets),
  };
}

export const knexConfig = async () => {
  const configuration = await buildConfigurationForEnv();
  return {
    ...configuration,
  };
};

export default knexConfig;
