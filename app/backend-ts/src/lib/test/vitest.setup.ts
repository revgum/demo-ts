import { vi } from 'vitest';
import { mockedLogger } from './utils';

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
vi.mock('@/lib/shared/metrics');
vi.mock('@/lib/context', () => {
  const context = {
    serviceName: 'test-service',
    handlerName: 'test-handler',
    api: {
      version: '1.0',
      kind: 'unknown',
    },
    db: vi.fn(),
    dapr: {
      host: '0.0.0.0',
      port: '3001',
    },
    logger: mockedLogger,
  };
  return {
    buildServiceContext: vi.fn().mockReturnValue(context),
    buildHandlerContext: vi.fn().mockReturnValue(context),
  };
});
