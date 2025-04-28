import { DaprClient } from '@dapr/dapr';
import type { Context } from '../types';

let client: DaprClient | null = null;

export const buildDaprClient = <K>(context: Context<K>): DaprClient => {
  if (!client) {
    client = new DaprClient({
      daprHost: context.dapr.host,
      daprPort: context.dapr.port,
    });
  }
  return client;
};
