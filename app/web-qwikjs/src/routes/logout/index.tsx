import type { RequestHandler } from '@builder.io/qwik-city';
import { session } from '~/config';
import { deleteSession } from '~/services/session';

export const onGet: RequestHandler = async ({ cookie, redirect }) => {
  const sessionValue = cookie.get(session.cookieName)?.value;
  if (!sessionValue) {
    throw redirect(302, '/login');
  }
  deleteSession(sessionValue);
  cookie.delete(session.cookieName);
  throw redirect(302, '/login');
};
