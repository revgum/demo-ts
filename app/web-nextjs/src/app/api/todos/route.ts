import { getAll } from '@/services/todo';
import { type NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  const data = await getAll();
  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
