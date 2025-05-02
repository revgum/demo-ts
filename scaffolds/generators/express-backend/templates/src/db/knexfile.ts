import * as config from '@/config';
import { buildServiceContext } from '@/lib/shared/context';
import { buildKnexConfig } from '@/lib/shared/db/db';
import { get } from '@/lib/shared/secrets';
import type { ServiceSecrets } from '@/lib/shared/types';
import type { ContextKind } from '@/types';

async function buildConfigurationForEnv() {
  const context = await buildServiceContext(config);
  const serviceSecrets = await get<ContextKind, ServiceSecrets>({
    context,
    secretKey: config.secretsStore.key,
    secretStoreName: config.secretsStore.storeName,
  });

  return {
    [context.env]: buildKnexConfig(serviceSecrets, {
      db: config.db,
      secretsStore: config.secretsStore,
    }),
  };
}

export const knexConfig = async () => {
  const configuration = await buildConfigurationForEnv();
  return {
    ...configuration,
  };
};

export default knexConfig;
