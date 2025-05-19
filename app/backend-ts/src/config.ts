import type { SecretStoreName } from '@/lib/shared/secrets/types';

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return 'test';
    case 'development':
      return 'development';
    case 'staging':
      return 'staging';
    case 'production':
      return 'production';
    default:
      return 'development';
  }
};

const env = getEnv();

const serviceName = process.env.SERVICE_NAME || '';
if (!serviceName) {
  throw new Error(`Service configuration error, missing SERVICE_NAME in ENV.`);
}

const dapr = {
  host: process.env.DAPR_HOST || 'localhost',
  port: process.env.DAPR_PORT || '3001',
};
const server = {
  host: process.env.SERVER_HOST || '0.0.0.0',
  port: process.env.SERVER_PORT || '3001',
};
const db = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 5432,
  database: process.env.DB_NAME || 'postgres',
  schema: `${process.env.DB_SCHEMA || 'public'}${env === 'test' ? '_test' : ''}`,
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  debug: !!process.env.DB_DEBUG,
};
const runtime = {
  localhost: !!process.env.LOCALHOST,
  debug: !!process.env.DEBUG,
  logLevel: process.env.LOG_LEVEL || 'debug',
};
const secretsStore = {
  key: process.env.SECRETS_KEY || 'serviceSecrets',
  storeName: process.env.SECRETS_STORE_NAME || 'local-secretstore',
} as { key: string; storeName: SecretStoreName };

export { dapr, db, env, runtime, secretsStore, server, serviceName };
