import { randomUUID } from 'node:crypto';
import { routeLoader$ } from '@builder.io/qwik-city';
import { type InitialValues, formAction$, zodForm$ } from '@modular-forms/qwik';
import { LoginSchema } from '~/components/login/schemas';
import { session } from '~/config';
import { createSession } from '~/services/session';
import type { LoginForm } from '~/types';

// (Server-side) Preset the Login form with default values.
export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  login: '',
  password: '',
}));

// (Server-side) When the Login form is submitted attempt to validate the user
export const useFormAction = formAction$<LoginForm>(async (values, { url, send, fail, cookie, headers, redirect }) => {
  if (values.login && values.password) {
    // TODO: Get validated user from database
    const userId = randomUUID();
    if (userId) {
      // Create a session for the user and set the session cookie
      const sessionId = createSession(userId);
      cookie.set(session.cookieName, sessionId, { maxAge: session.expires / 1000, path: '/' }); // Set the session cookie

      // Redirect to the main page and send the response
      headers.set('Location', new URL('/todos', url).toString());
      const response = new Response(null, { status: 302 });
      send(response);
    } else {
      return fail(400, { message: 'Invalid login or password' });
    }
  }
  return fail(400, { message: 'Invalid login or password' });
}, zodForm$(LoginSchema));
