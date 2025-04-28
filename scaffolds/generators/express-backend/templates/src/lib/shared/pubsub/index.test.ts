import { buildDaprClient } from '@/lib/shared/dapr';
import type { Context } from '@/types';
import type { PubSubPublishOptions } from '@dapr/dapr/types/pubsub/PubSubPublishOptions.type';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { publish, PubSubNames } from './index';

vi.mock('@/lib/shared/dapr', () => ({
  buildDaprClient: vi.fn(),
}));

describe('publish', () => {
  const mockDaprClient = {
    pubsub: {
      publish: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (buildDaprClient as Mock).mockReturnValue(mockDaprClient);
  });

  it('should call daprClient.pubsub.publish with correct arguments', async () => {
    const context = {} as Context;
    const pubSubName = PubSubNames.REDIS;
    const pubSubTopic = 'test-topic';
    const data = { key: 'value' };
    const metadata = { metaKey: 'metaValue' } as PubSubPublishOptions;

    await publish({
      context,
      pubSubName,
      pubSubTopic,
      data,
      metadata,
    });

    expect(buildDaprClient).toHaveBeenCalledWith(context);
    expect(mockDaprClient.pubsub.publish).toHaveBeenCalledWith(
      pubSubName,
      pubSubTopic,
      data,
      metadata,
    );
  });

  it('should handle undefined data', async () => {
    const context = {} as Context;
    const pubSubName = PubSubNames.REDIS;
    const pubSubTopic = 'test-topic';
    const data = undefined;
    const metadata = undefined;

    await publish({
      context,
      pubSubName,
      pubSubTopic,
      data,
      metadata,
    });

    expect(buildDaprClient).toHaveBeenCalledWith(context);
    expect(mockDaprClient.pubsub.publish).toHaveBeenCalledWith(
      pubSubName,
      pubSubTopic,
      data,
      metadata,
    );
  });
});
