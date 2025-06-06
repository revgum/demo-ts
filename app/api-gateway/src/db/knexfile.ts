import * as config from '@/config';
import type { ContextKind } from '@/types';
import { buildServiceContext, Db, Secrets, type ServiceSecrets } from '@sos/sdk';

async function buildConfigurationForEnv() {
  const context = await buildServiceContext<ContextKind>(config);
  const serviceSecrets = await Secrets.get<ContextKind, ServiceSecrets>({
    context,
    secretKey: config.secretsStore.key,
    secretStoreName: config.secretsStore.storeName,
  });

  return {
    [context.env]: Db.buildKnexConfig(serviceSecrets, {
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
