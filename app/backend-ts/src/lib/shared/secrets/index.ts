import { buildDaprClient } from '@/lib/shared/dapr';
import type { SecretsArgs } from './types';

export const SecretStoreNames = { LOCAL: 'local-secretstore' } as const;

export const get = async <K, T>({
  context,
  secretStoreName,
  secretKey,
}: SecretsArgs<K>): Promise<T> => {
  const daprClient = buildDaprClient(context);
  return daprClient.secret.get(secretStoreName, secretKey) as T;
};
