import { buildDaprClient } from '@/lib/shared/dapr';
import type { KeyValuePairType } from '@dapr/dapr/types/KeyValuePair.type';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Context } from '../types';
import { destroy, save, StateNames } from './index';

vi.mock('@/lib/shared/dapr', () => ({
  buildDaprClient: vi.fn(),
}));

const mockDaprClient = {
  state: {
    save: vi.fn(),
    delete: vi.fn(),
  },
};

describe('State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (buildDaprClient as Mock).mockReturnValue(mockDaprClient);
  });

  describe('save', () => {
    it('calls daprClient.state.save with correct arguments', async () => {
      const context = {} as Context<unknown>;
      const stateName = StateNames.REDIS;
      const key = 'test-key';
      const value = 'test-value';
      const metadata = { metaKey: 'metaValue' } as KeyValuePairType['metadata'];

      await save({
        context,
        stateName,
        stateObjects: [{ key, value, metadata }],
      });

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.state.save).toHaveBeenCalledWith(
        stateName,
        [{ key: `redis-state:${key}`, value, metadata }],
        undefined,
      );
    });
  });

  describe('destroy', () => {
    it('calls daprClient.state.delete with correct arguments', async () => {
      const context = {} as Context<unknown>;
      const stateName = StateNames.REDIS;
      const key = 'test-key';

      await destroy({
        context,
        stateName,
        id: key,
      });

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.state.delete).toHaveBeenCalledWith(
        stateName,
        `redis-state:${key}`,
        undefined,
      );
    });
  });
});
