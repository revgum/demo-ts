import { HttpMethod } from '@dapr/dapr';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { invoke } from '.';
import { buildDaprClient } from '../dapr';
import type { Context } from '../types';

vi.mock('../dapr', () => ({
  buildDaprClient: vi.fn(),
}));

const mockDaprClient = {
  invoker: {
    invoke: vi.fn(),
  },
};

describe('Invoke', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (buildDaprClient as Mock).mockReturnValue(mockDaprClient);
  });

  describe('invoke', () => {
    it('calls daprClient.invoker.invoke with correct arguments', async () => {
      const context = {} as Context<unknown>;
      const appId = 'test-backend';
      const methodName = 'api/v1/todos';
      const method = HttpMethod.GET;
      await invoke({ context, appId, methodName, method });

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.invoker.invoke).toHaveBeenCalledWith(
        appId,
        methodName,
        method,
        undefined,
        undefined,
      );
    });
  });
});
