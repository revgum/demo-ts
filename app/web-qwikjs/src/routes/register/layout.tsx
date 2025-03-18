import { routeLoader$ } from '@builder.io/qwik-city';
import { FormError, type InitialValues, formAction$, zodForm$ } from '@modular-forms/qwik';
import { RegisterSchema } from '~/components/auth/schemas';
import { session } from '~/config';
import { createSession } from '~/services/session';
import { createUser, getUserByLogin } from '~/services/user';
import type { RegisterForm } from '~/types';

// (Server-side) Preset the Registar form with default values.
export const useFormLoader = routeLoader$<InitialValues<RegisterForm>>(() => ({
  login: '',
  password: '',
  password_confirmation: '',
}));

// (Server-side) When the Register form is submitted attempt to create the user
export const useFormAction = formAction$<RegisterForm>(async (values, { redirect, cookie }) => {
  if (
    values.login &&
    values.password &&
    values.password_confirmation &&
    values.password === values.password_confirmation
  ) {
    const existingUser = getUserByLogin(values.login);
    if (existingUser) {
      throw new FormError('User registration failed');
    }
    const user = await createUser(values.login, values.password);
    // Create a session for the user and set the session cookie
    const sessionId = createSession(user.id);
    cookie.set(session.cookieName, sessionId, { maxAge: session.expires / 1000, path: '/' }); // Set the session cookie

    // Redirect to the main page
    throw redirect(302, '/todos');
  }
  throw new FormError('User registration failed.');
}, zodForm$(RegisterSchema));
