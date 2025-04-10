const getEnv = () => {
  switch (process.env.NODE_ENV) {
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
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'postgres-ts',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  debug: !!process.env.DB_DEBUG,
};
const runtime = {
  localhost: !!process.env.LOCALHOST,
  debug: !!process.env.DEBUG,
  logLevel: process.env.LOG_LEVEL || 'debug',
};

const env = getEnv();

export { dapr, server, db, env, runtime };
