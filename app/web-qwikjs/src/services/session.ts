import crypto from 'node:crypto';
import type { Cookie } from '@builder.io/qwik-city';
import { session } from '~/config';
import type { User } from '~/types';

// Replace in-memory session store with a more persistent solution (e.g., Redis, database) for production use
// This is a simple in-memory session store for demonstration purposes only.
const sessions = new Map<string, { userId: User['id']; expires: number }>();

const pruneExpiredSessions = () => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (session.expires < now) {
      sessions.delete(sessionId); // Remove expired sessions
    }
  }
  console.log('Pruned expired sessions, active sessions remaining:', Array.from(sessions.keys()));
};

export const createSession = (userId: string) => {
  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { userId, expires: Date.now() + session.expires });
  return sessionId;
};

export const getUserFromSession = (sessionId: string) => {
  const session = sessions.get(sessionId);
  if (!session) {
    return null;
  }
  if (session.expires < Date.now()) {
    deleteSession(sessionId); // Session expired, delete it
    return null;
  }
  return session.userId;
};

export const deleteSession = (sessionId: string) => {
  sessions.delete(sessionId);
};

export const loadUserFromCookie = async (cookie: Cookie) => {
  const sessionCookie = cookie.get(session.cookieName);
  if (!sessionCookie) {
    return null;
  }
  pruneExpiredSessions();
  const userId = getUserFromSession(sessionCookie.value); // Check if session is valid
  if (!userId) {
    cookie.delete(session.cookieName); // Delete invalid session cookie
    return null;
  }
  return userId;
};
