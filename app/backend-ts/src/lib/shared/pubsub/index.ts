import { buildDaprClient } from '@/lib/shared/dapr';
import type { PubSubArgs } from './types';

export const PubSubNames = { REDIS: 'redis-pubsub' } as const;

export const publish = async <T extends string | object | undefined>({
  context,
  pubSubName,
  pubSubTopic,
  data,
  metadata,
}: PubSubArgs<T>) => {
  const daprClient = buildDaprClient(context);
  return daprClient.pubsub.publish(pubSubName, pubSubTopic, data, metadata);
};
