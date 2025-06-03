import { expectConsumerDataResponse } from '@/lib/test/utils';
import type { ContextKind, Todo } from '@/types';
import { buildServiceContext, Consumer, type Context, type ContextConfig } from '@sos/sdk';
import { testEndpoint } from 'express-zod-api';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import * as todoConsumer from './todo-consumer';

describe('Todo Consumer', () => {
  const mockTodos: Todo[] = [
    {
      id: randomUUID(),
      title: 'Test Todo',
      kind: 'todo',
      createdAt: new Date().toISOString(),
      completed: true,
    },
  ];

  const mockPubSubMessage: Consumer.CloudEvent & { data: Todo } = {
    id: randomUUID(),
    datacontenttype: 'application/cloudevent+json',
    pubsubname: 'redis-pubsub',
    source: 'backend-ts',
    specversion: '1.0',
    time: new Date().toISOString(),
    topic: 'todo-data',
    traceid: randomUUID(),
    traceparent: randomUUID(),
    tracestate: '',
    type: 'cloud.event.example.type',
    data: mockTodos[0],
  };

  let mockedContext: Mocked<Context<ContextKind>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockedContext = (await buildServiceContext({} as ContextConfig<ContextKind>)) as Mocked<
      Context<ContextKind>
    >;
  });

  describe('handleTodo', () => {
    const testHandleTodoEndpoint = async (body?: any) =>
      testEndpoint({
        endpoint: todoConsumer.handleMessage(mockedContext),
        requestProps: {
          method: 'POST',
          body: body || mockPubSubMessage,
        },
      });

    it('responds with a consumer data success response', async () => {
      const { responseMock, loggerMock } = await testHandleTodoEndpoint();
      expectConsumerDataResponse(responseMock, { status: Consumer.ConsumerStatuses.SUCCESS });
      expect(loggerMock._getLogs().error).toHaveLength(0);
      expect(responseMock._getStatusCode()).toBe(200);
    });

    it('responds with a consumer data drop response for malformed messages', async () => {
      const { responseMock, loggerMock } = await testHandleTodoEndpoint({ invalid_field: 'field' });
      expectConsumerDataResponse(responseMock, { status: Consumer.ConsumerStatuses.DROP });
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(200);
    });
  });
});
