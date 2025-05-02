import { ConsumerStatuses, type CloudEvent } from '@/lib/shared/consumer';
import { buildServiceContext } from '@/lib/shared/context';
import * as Metrics from '@/lib/shared/metrics';
import type { Context, ContextConfig } from '@/lib/shared/types';
import { expectConsumerDataResponse } from '@/lib/test/utils';
import type { ContextKind, Todo } from '@/types';
import { testEndpoint } from 'express-zod-api';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import * as todoConsumer from './todo-consumer';

// Mocked in vitest.setup.ts
const mockedMetrics = Metrics as Mocked<typeof Metrics>;

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

  const mockPubSubMessage: CloudEvent & { data: Todo } = {
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
  let mockedCounter: Mocked<ReturnType<typeof mockedMetrics.createCounter>>;
  let mockedTimer: Mocked<ReturnType<typeof mockedMetrics.createTimer>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockedContext = (await buildServiceContext({} as ContextConfig<ContextKind>)) as Mocked<
      Context<ContextKind>
    >;
    mockedMetrics.createCounter.mockReturnValue({ add: vi.fn() });
    mockedMetrics.createTimer.mockReturnValue({ record: vi.fn() });
    mockedCounter = mockedMetrics.createCounter(mockedContext) as Mocked<
      ReturnType<typeof mockedMetrics.createCounter>
    >;
    mockedTimer = mockedMetrics.createTimer(mockedContext) as Mocked<
      ReturnType<typeof mockedMetrics.createTimer>
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
      expectConsumerDataResponse(responseMock, { status: ConsumerStatuses.SUCCESS });
      expect(loggerMock._getLogs().error).toHaveLength(0);
      expect(responseMock._getStatusCode()).toBe(200);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        status: ConsumerStatuses.SUCCESS,
        pubsubname: 'redis-pubsub',
        source: expect.any(String),
        topic: 'todo-data',
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        status: ConsumerStatuses.SUCCESS,
        pubsubname: 'redis-pubsub',
        source: expect.any(String),
        topic: 'todo-data',
      });
    });

    it('responds with a consumer data drop response for malformed messages', async () => {
      const { responseMock, loggerMock } = await testHandleTodoEndpoint({ invalid_field: 'field' });
      expectConsumerDataResponse(responseMock, { status: ConsumerStatuses.DROP });
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(200);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        status: ConsumerStatuses.DROP,
        inputValidationError: true,
      });
    });
  });
});
