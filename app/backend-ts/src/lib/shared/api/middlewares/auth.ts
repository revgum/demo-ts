import { Middleware } from 'express-zod-api';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  sub: string; // UserId
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) throw new Error('Server configuration error, missing JWT signing key.');

export const AuthMiddleware = new Middleware({
  security: { type: 'header', name: 'Authorization' },
  handler: async ({ request, logger }) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw createHttpError(401, 'Missing token');

    const payload = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload | jwt.JsonWebTokenError;
    if (payload instanceof jwt.JsonWebTokenError) throw createHttpError(401, 'Invalid token');
    if (!payload.sub) throw createHttpError(401, 'Invalid token');

    const user = { id: 'a1b2c3' };
    if (user.id !== payload.sub) throw createHttpError(422, 'Unauthorized');

    logger.info({ userId: payload.sub }, 'User authenticated');
    return { user }; // provides endpoints with options.user
  },
});
