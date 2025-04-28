import { vi } from 'vitest';

process.env.NODE_ENV = 'test';

vi.mock('@dapr/dapr', () => {
  return {
    DaprClient: vi.fn(),
    DaprServer: vi.fn(),
    CommunicationProtocolEnum: {
      HTTP: 'HTTP',
    },
  };
});
vi.mock('@/lib/shared/api/user');
/*
vi.mock('@/lib/shared/dapr/client', () => {
  return {
    buildDaprClient: () => ({
      pubsub: {
        publish: vi.fn(),
      },
    }),
  };
});
*/
vi.mock('@/lib/metrics');
vi.mock('@/lib/context', () => {
  return {
    context: {
      api: {
        version: '1.0',
        kind: 'unknown',
      },
      db: vi.fn(),
      dapr: {
        host: '0.0.0.0',
        port: '3001',
      },
    },
  };
});
