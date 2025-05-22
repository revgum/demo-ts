import { buildDaprClient } from '@/lib/shared/dapr';
import type { KeyValuePairType } from '@dapr/dapr/types/KeyValuePair.type';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Context } from '../types';
import { destroy, get, save, StateNames } from './index';

vi.mock('@/lib/shared/dapr', () => ({
  buildDaprClient: vi.fn(),
}));

const mockDaprClient = {
  state: {
    save: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
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
        [{ key, value, metadata }],
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
        key,
      });

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.state.delete).toHaveBeenCalledWith(stateName, key, undefined);
    });
  });

  describe('get', () => {
    it('calls daprClient.state.get with correct arguments', async () => {
      const context = {} as Context<unknown>;
      const stateName = StateNames.REDIS;
      const key = 'test-key';

      await get({
        context,
        stateName,
        key,
      });

      expect(buildDaprClient).toHaveBeenCalledWith(context);
      expect(mockDaprClient.state.get).toHaveBeenCalledWith(stateName, key, undefined);
    });
  });
});
