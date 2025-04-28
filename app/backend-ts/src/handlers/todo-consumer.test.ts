import { context } from '@/lib/context';
import { ConsumerStatuses, type CloudEvent } from '@/lib/shared/consumer';
import * as Metrics from '@/lib/shared/metrics';
import { expectConsumerDataResponse } from '@/lib/test/utils';
import type { Todo } from '@/types';
import { testEndpoint } from 'express-zod-api';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import * as todoConsumerHandlers from './todo-consumer';

// Mocked in vitest.setup.ts
const mockedMetrics = Metrics as Mocked<typeof Metrics>;

describe('Todo Consumer Handlers', () => {
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

  let mockedCounter: Mocked<ReturnType<typeof mockedMetrics.createCounter>>;
  let mockedTimer: Mocked<ReturnType<typeof mockedMetrics.createTimer>>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockedMetrics.createCounter.mockReturnValue({ add: vi.fn() });
    mockedMetrics.createTimer.mockReturnValue({ record: vi.fn() });
    mockedCounter = mockedMetrics.createCounter(context, 'handlerName', 'counterName') as Mocked<
      ReturnType<typeof mockedMetrics.createCounter>
    >;
    mockedTimer = mockedMetrics.createTimer(context, 'handlerName', 'counterName') as Mocked<
      ReturnType<typeof mockedMetrics.createTimer>
    >;
  });

  describe('handleTodo', () => {
    const testHandleTodoEndpoint = async (body?: any) =>
      testEndpoint({
        endpoint: todoConsumerHandlers.handleTodo,
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
        success: true,
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        success: true,
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
        success: false,
        inputValidationError: true,
      });
    });
  });
});
