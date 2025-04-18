const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'development';
    case 'test':
      return 'test';
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
const env = getEnv();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('Server configuration error, missing JWT signing key.');
}

const cookie = {
  name: process.env.COOKIE_NAME || 'session',
  jwtSecret,
  maxAge: process.env.COOKIE_MAX_AGE ? Number.parseInt(process.env.COOKIE_MAX_AGE) : 60 * 60 * 24 * 7, // 7 days
  httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
};

export { dapr, env, cookie };
