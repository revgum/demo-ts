import type { ContextKind } from '@/types';
import { type Context, type User, Api } from '@sos/sdk';
import type { JwtPayload } from 'jsonwebtoken';

export const getUser: Api.GetJwtUser<Context<ContextKind>> = async (
  context: Context<ContextKind>,
  payload: JwtPayload,
): Promise<{ user: User }> => {
  // TODO: Using payload.sub, fetch the user from an auth service. Then remove the guard below.
  if (context.env === 'production') {
    throw new Error('User authentication not implemented');
  }
  if (!payload.sub) {
    context.logger.error(
      'JWT provided to user service is missing "sub" property intended to be the user.id',
    );
    throw new Error('Malformed JWT payload, unable to authenticate user.');
  }
  return { user: { id: payload.sub } };
};
