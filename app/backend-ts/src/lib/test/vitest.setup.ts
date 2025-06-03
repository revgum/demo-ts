import { vi } from 'vitest';
import { mockedLogger } from './utils';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET_KEY = 'test';

vi.mock('@dapr/dapr', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as unknown as object),
    DaprClient: vi.fn(),
    DaprServer: vi.fn(),
  };
});
vi.mock('@sos/sdk', async (importOriginal) => {
  const actual = await importOriginal();
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
    // @ts-ignore
    ...actual,
    buildServiceContext: vi.fn().mockReturnValue(context),
    buildHandlerContext: vi.fn().mockReturnValue(context),
  };
});
