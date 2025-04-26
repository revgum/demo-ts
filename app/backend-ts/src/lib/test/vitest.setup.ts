import { vi } from 'vitest';

process.env.NODE_ENV = 'test';

vi.mock('@/lib/shared/api/user');
vi.mock('@/lib/metrics');
vi.mock('@/lib/context', () => {
  return {
    context: {
      api: {
        version: '1.0',
        kind: 'unknown',
      },
      db: vi.fn(),
    },
  };
});
