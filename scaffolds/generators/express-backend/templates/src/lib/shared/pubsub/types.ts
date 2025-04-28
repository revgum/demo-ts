import type { PubSubPublishOptions } from '@dapr/dapr/types/pubsub/PubSubPublishOptions.type';
import type { PubSubNames } from '.';
import type { Context } from '../types';

type PubSubNames = (typeof PubSubNames)[keyof typeof PubSubNames];

export type PubSubArgs<T extends string | object | undefined, K> = {
  context: Context<K>;
  pubSubName: PubSubNames;
  pubSubTopic: string;
  data: T;
  metadata?: PubSubPublishOptions;
};
