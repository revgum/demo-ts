import type { Context } from '@/types';
import { DaprClient } from '@dapr/dapr';
import { describe, expect, it } from 'vitest';
import { buildDaprClient } from './client';

describe('buildDaprClient', () => {
  it('should create a new DaprClient instance if none exists', () => {
    const mockContext: Context = {
      dapr: {
        host: 'localhost',
        port: '3500',
      },
    } as Context;

    const client = buildDaprClient(mockContext);

    expect(DaprClient).toHaveBeenCalledWith({
      daprHost: 'localhost',
      daprPort: '3500',
    });
    expect(client).toBeInstanceOf(DaprClient);
  });

  it('should return the existing DaprClient instance if already created', () => {
    const mockContext: Context = {
      dapr: {
        host: 'localhost',
        port: '3500',
      },
    } as Context;

    const firstClient = buildDaprClient(mockContext);
    const secondClient = buildDaprClient(mockContext);

    expect(firstClient).toBe(secondClient);
    expect(DaprClient).toHaveBeenCalledTimes(1);
  });
});
