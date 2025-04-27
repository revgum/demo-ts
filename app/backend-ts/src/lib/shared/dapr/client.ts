import type { Context } from '@/types';
import { DaprClient } from '@dapr/dapr';

let client: DaprClient | null = null;

export const buildDaprClient = (context: Context): DaprClient => {
  if (!client) {
    client = new DaprClient({
      daprHost: context.dapr.host,
      daprPort: context.dapr.port,
    });
  }
  return client;
};
