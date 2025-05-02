import { db, secretsStore } from '@/config';
import { buildServiceContext } from '@/lib/context';
import { buildKnexConfig } from '@/lib/shared/db/db';
import { get } from '@/lib/shared/secrets';
import type { ServiceSecrets } from '@/lib/shared/types';
import type { ContextKind } from '@/types';

async function buildConfigurationForEnv() {
  const context = await buildServiceContext();
  const serviceSecrets = await get<ContextKind, ServiceSecrets>({
    context,
    secretKey: secretsStore.key,
    secretStoreName: secretsStore.storeName,
  });

  return {
    [context.env]: buildKnexConfig(serviceSecrets, { db, secretsStore }),
  };
}

export const knexConfig = async () => {
  const configuration = await buildConfigurationForEnv();
  return {
    ...configuration,
  };
};

export default knexConfig;
