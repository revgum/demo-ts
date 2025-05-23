import { buildDaprClient } from '@/lib/shared/dapr';
import { mockedLogger } from '@/lib/test/utils';
import { HttpMethod } from '@dapr/dapr';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { fetch, type FetchArgs } from '.';
import type { Context } from '../types';

vi.mock('@/lib/shared/dapr', () => ({
  buildDaprClient: vi.fn(),
}));

const mockDaprClient = {
  invoker: {
    invoke: vi.fn(),
  },
  state: {
    get: vi.fn(),
  },
};

describe('Cache', () => {
  const todoId = randomUUID();
  const context = { logger: mockedLogger } as Context<unknown>;
  const fetchArgs = {
    context,
    cacheArgs: {
      stateName: 'redis-state',
      key: 'test-statename:id',
    },
    serviceArgs: {
      appId: 'backend-ts',
      method: HttpMethod.GET,
      methodName: `/api/v1/todos/${todoId}`,
      options: {
        headers: {
          Authorization: `Bearer ${context.requestToken}`,
        },
      },
    },
  } satisfies FetchArgs<unknown, string>;

  beforeEach(() => {
    vi.clearAllMocks();
    (buildDaprClient as Mock).mockReturnValue(mockDaprClient);
  });

  describe('fetch', () => {
    it('returns data from cache when found', async () => {
      mockDaprClient.state.get.mockResolvedValue({ id: todoId });
      await fetch(fetchArgs);

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.state.get).toHaveBeenCalled();
      expect(mockDaprClient.invoker.invoke).not.toHaveBeenCalled();
    });

    it('returns data from service invocation when cache data is not found', async () => {
      mockDaprClient.state.get.mockResolvedValue(undefined);
      await fetch(fetchArgs);

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.state.get).toHaveBeenCalled();
      expect(mockDaprClient.invoker.invoke).toHaveBeenCalled();
    });
  });
});
