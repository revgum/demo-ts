import { buildDaprClient } from '@/lib/shared/dapr';
import type { PubSubArgs } from './types';

export const PubSubNames = { REDIS: 'redis-pubsub' } as const;

export const publish = async <T extends string | object | undefined, K>({
  context,
  pubSubName,
  pubSubTopic,
  data,
  metadata,
}: PubSubArgs<T, K>) => {
  const daprClient = buildDaprClient(context);
  return daprClient.pubsub.publish(pubSubName, pubSubTopic, data, metadata);
};
