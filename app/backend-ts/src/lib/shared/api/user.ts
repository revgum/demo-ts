import { env } from '@/config';
import type { JwtPayload } from 'jsonwebtoken';

export const getUser = async (payload: JwtPayload) => {
  // TODO: Using payload.sub, fetch the user from an auth service. Then remove the guard below.
  if (env === 'production') {
    throw new Error('User authentication not implemented');
  }
  return { id: payload.sub };
};
