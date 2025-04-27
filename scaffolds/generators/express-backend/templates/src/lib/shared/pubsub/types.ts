import type { Context } from '@/types';
import type { PubSubPublishOptions } from '@dapr/dapr/types/pubsub/PubSubPublishOptions.type';
import type { PubSubNames } from '.';

type PubSubNames = (typeof PubSubNames)[keyof typeof PubSubNames];

export type PubSubArgs<T extends string | object | undefined> = {
  context: Context;
  pubSubName: PubSubNames;
  pubSubTopic: string;
  data: T;
  metadata?: PubSubPublishOptions;
};
