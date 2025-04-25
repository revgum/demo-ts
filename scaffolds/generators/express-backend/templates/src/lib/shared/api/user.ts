import type { JwtPayload } from 'jsonwebtoken';

const env = process.env.NODE_ENV;
if (!env) throw new Error('Server configuration error, missing node env.');

export const getUser = async (payload: JwtPayload) => {
  // TODO: Using payload.sub, fetch the user from an auth service. Then remove the guard below.
  if (env === 'production') {
    throw new Error('User authentication not implemented');
  }
  return { id: payload.sub };
};
