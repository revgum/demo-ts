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
  host: process.env.DAPR_HOST || '127.0.0.1',
  port: process.env.DAPR_PORT || '3001',
};
const server = {
  host: process.env.SERVER_HOST || '127.0.0.1',
  port: process.env.SERVER_PORT || '3001',
};
const db = {
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : false,
  debug: !!process.env.DB_DEBUG,
};
const env = getEnv();

export { dapr, server, db, env };
