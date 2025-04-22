import 'server-only';
import { cookie, env, jwtSecretKey } from '@/config';
import type { Session } from '@/types';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const sign = (payload: string | Buffer | object) => {
  return jwt.sign(payload, jwtSecretKey, {
    expiresIn: cookie.maxAge,
  });
};

export const verify = (session: string | undefined = '') => {
  try {
    const { payload } = jwt.verify(session, jwtSecretKey, {
      complete: true,
    });
    return payload as JwtPayload;
  } catch {
    console.error('Session verification failed: invalid token');
  }
};

export const createSession = async (userId: string) => {
  const jwt = sign({ sub: userId });
  const cookieStore = await cookies();

  cookieStore.set(cookie.name, jwt, {
    httpOnly: cookie.httpOnly,
    secure: env === 'development' ? false : cookie.secure,
    maxAge: cookie.maxAge,
    sameSite: cookie.sameSite as 'lax' | 'strict' | 'none',
    path: '/',
  });
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(cookie.name);
};

/**
 * Verifies the session and returns the userId and token if valid. If the session is invalid, it redirects to the home page.
 * React Server Components cache are invalidated on every request. https://react.dev/reference/react/cache#caveats
 * @returns {Promise<Session>}
 */
export const verifySession = cache(async (): Promise<Session> => {
  const jwt = (await cookies()).get(cookie.name)?.value;
  const session = verify(jwt);

  if (!session?.sub || !jwt) {
    console.error('Invalid session, redirecting to home page');
    redirect('/');
  }

  return { userId: session.sub, token: jwt };
});
