import { routeLoader$ } from '@builder.io/qwik-city';
import { FormError, type InitialValues, formAction$, zodForm$ } from '@modular-forms/qwik';
import { LoginSchema } from '~/components/auth/schemas';
import { session } from '~/config';
import { createSession } from '~/services/session';
import { getUserByLogin, validateUser } from '~/services/user';
import type { LoginForm } from '~/types';

// (Server-side) Preset the Login form with default values.
export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  login: '',
  password: '',
}));

// (Server-side) When the Login form is submitted attempt to validate the user
export const useFormAction = formAction$<LoginForm>(async (values, { cookie, redirect }) => {
  if (!values.login || !values.password) {
    throw new FormError('Login and password are required');
  }
  const loggedIn = await validateUser(values.login, values.password);
  if (!loggedIn) {
    throw new FormError('Invalid login or password');
  }
  const user = getUserByLogin(values.login);
  if (!user) {
    throw new FormError('Invalid login or password');
  }

  // Create a session for the user and set the session cookie
  const sessionId = createSession(user.id);
  cookie.set(session.cookieName, sessionId, { maxAge: session.expires / 1000, path: '/' }); // Set the session cookie

  // Redirect to the main page
  throw redirect(302, '/todos');
}, zodForm$(LoginSchema));
