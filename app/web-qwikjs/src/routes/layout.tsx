import { Slot, component$ } from '@builder.io/qwik';
import { type RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import { loadUserFromCookie, sessions } from '~/services/session';
import type { SessionStore, User } from '~/types';

// Generic function `onRequest` is executed before any method specific handler (like `onGet`).
export const onRequest: RequestHandler = async ({ next, sharedMap, cookie, redirect, url }) => {
  sharedMap.set('sessions', sessions);

  if (
    url.pathname.startsWith('/login/') ||
    url.pathname.startsWith('/register/') ||
    url.pathname.startsWith('/logout/')
  ) {
    // Skip authentication for the auth pages
    return await next();
  }

  const user = await loadUserFromCookie(cookie);
  if (!user) {
    // No user session found, set user to null and redirect to login page
    sharedMap.set('user', null);
    throw redirect(302, new URL('/login', url).toString());
  }
  sharedMap.set('user', user);
  await next();
};

export const onGet: RequestHandler = async ({ next, cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
  await next();
};

export const useUser = routeLoader$(({ sharedMap }) => {
  return sharedMap.get('user') as User | null;
});

export const useSessions = routeLoader$(({ sharedMap }) => {
  return sharedMap.get('sessions') as SessionStore | null;
});

export default component$(() => {
  return <Slot />;
});
