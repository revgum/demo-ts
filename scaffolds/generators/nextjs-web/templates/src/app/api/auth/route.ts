import { env } from '@/config';
import { createSession } from '@/lib/session';
import type { NextRequest } from 'next/server';

/**
 * Convenience endpoint to create a session for a user for use in development.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  if (env !== 'development') {
    return Response.json({
      message: 'This endpoint is only available in development mode.',
    });
  }

  await createSession('a1b2c3');
  return Response.json({
    message: 'Session created for user.',
  });
}

/**
 * Example endpoint allowing for an Auth callback to POST user data for a validated session/user.
 */
export async function POST(request: NextRequest) {
  const { userId } = await request.json();
  await createSession(userId);
  return Response.json({
    message: 'Session created for user.',
  });
}
