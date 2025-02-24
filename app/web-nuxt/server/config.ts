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

const localDev = Boolean(process.env.LOCAL_DEV || false);
const env = getEnv();

export { dapr, env, localDev };
