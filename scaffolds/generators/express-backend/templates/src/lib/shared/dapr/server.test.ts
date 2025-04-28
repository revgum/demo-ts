import { CommunicationProtocolEnum, DaprServer } from '@dapr/dapr';
import type { Express } from 'express';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import type { Context } from '../types';
import { buildDaprServer } from './server';

describe('buildDaprServer', () => {
  const mockContext = {
    server: { host: 'localhost', port: '3000' },
    dapr: { host: 'localhost', port: '3500' },
  } as Context<unknown>;

  const mockApp = {} as Express;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new DaprServer instance if none exists', () => {
    const mockDaprServerInstance = {};
    (DaprServer as unknown as Mock).mockImplementation(() => mockDaprServerInstance);

    const server = buildDaprServer(mockContext, mockApp);

    expect(DaprServer).toHaveBeenCalledWith({
      serverHost: 'localhost',
      serverPort: '3000',
      serverHttp: mockApp,
      communicationProtocol: CommunicationProtocolEnum.HTTP,
      clientOptions: {
        daprHost: 'localhost',
        daprPort: '3500',
      },
    });
    expect(server).toBe(mockDaprServerInstance);
  });
});
