import { context } from '@/lib/context';
import * as Metrics from '@/lib/metrics';
import * as ApiUser from '@/lib/shared/api/user';
import { expectApiDataResponse, expectApiError, getAuthHeader } from '@/lib/test/utils';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import type { Todo } from '@/types';
import { testEndpoint } from 'express-zod-api';
import { randomUUID } from 'node:crypto';
import { afterEach } from 'node:test';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import * as todoHandlers from './todo';

vi.mock('@/models/todo');
vi.mock('@/lib/shared/api/user');
vi.mock('@/lib/metrics');
vi.mock('@/lib/context', () => ({
  context: {
    api: {
      version: '1.0',
      kind: 'todo',
    },
  },
}));

const mockedApiUser = ApiUser as Mocked<typeof ApiUser>;
const mockedMetrics = Metrics as Mocked<typeof Metrics>;

describe('Todo Handlers', () => {
  const mockUser = {
    id: 'test-user-id',
  };
  const mockTodos: Todo[] = [
    {
      id: randomUUID(),
      title: 'Test Todo',
      kind: 'todo',
      createdAt: new Date().toISOString(),
      completed: true,
    },
  ];

  let mockedCounter: Mocked<ReturnType<typeof mockedMetrics.createCounter>>;
  let mockedTimer: Mocked<ReturnType<typeof mockedMetrics.createTimer>>;

  beforeEach(() => {
    mockedApiUser.getUser.mockResolvedValue({ id: mockUser.id });
    mockedMetrics.createCounter.mockReturnValue({ add: vi.fn() });
    mockedMetrics.createTimer.mockReturnValue({ record: vi.fn() });
    mockedCounter = mockedMetrics.createCounter(context, 'handlerName', 'counterName') as Mocked<
      ReturnType<typeof mockedMetrics.createCounter>
    >;
    mockedTimer = mockedMetrics.createTimer(context, 'handlerName', 'counterName') as Mocked<
      ReturnType<typeof mockedMetrics.createTimer>
    >;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllTodo', () => {
    const testGetAllEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.getAllTodo,
        requestProps: {
          method: 'GET',
          headers: {
            ...getAuthHeader(mockUser.id),
          },
        },
      });

    it('responds with an API data response', async () => {
      vi.mocked(getAll).mockResolvedValue(mockTodos);

      const { responseMock, loggerMock } = await testGetAllEndpoint();
      expectApiDataResponse(responseMock, { items: mockTodos });
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

    it('responds with an API error response', async () => {
      vi.mocked(getAll).mockRejectedValue(new Error('Database error'));

      const { responseMock, loggerMock } = await testGetAllEndpoint();
      expectApiError(responseMock);
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(500);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        success: false,
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        success: false,
      });
    });
  });

  describe('createTodo', () => {
    const testCreateEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.createTodo,
        requestProps: {
          method: 'POST',
          headers: {
            ...getAuthHeader(mockUser.id),
          },
          body: {
            title: mockTodos[0].title,
            dueAt: mockTodos[0].dueAt,
            completed: mockTodos[0].completed,
          },
        },
      });

    it('responds with an API data response', async () => {
      vi.mocked(create).mockResolvedValue(mockTodos[0]);

      const { responseMock, loggerMock } = await testCreateEndpoint();
      expectApiDataResponse(responseMock, { ...mockTodos[0] });
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

    it('responds with an API error response', async () => {
      vi.mocked(create).mockRejectedValue(new Error('Database error'));

      const { responseMock, loggerMock } = await testCreateEndpoint();
      expectApiError(responseMock);
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(500);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        success: false,
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        success: false,
      });
    });
  });

  describe('updateTodoById', () => {
    const testUpdateEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.updateTodoById,
        requestProps: {
          method: 'PUT',
          params: {
            id: mockTodos[0].id,
          },
          headers: {
            ...getAuthHeader(mockUser.id),
          },
          body: {
            title: mockTodos[0].title,
            completed: false,
          },
        },
      });

    it('responds with an API data response', async () => {
      vi.mocked(updateById).mockResolvedValue({ ...mockTodos[0], completed: false });

      const { responseMock, loggerMock } = await testUpdateEndpoint();
      expectApiDataResponse(responseMock, { ...mockTodos[0], completed: false });
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

    it('responds with an API error response', async () => {
      vi.mocked(updateById).mockRejectedValue(new Error('Database error'));

      const { responseMock, loggerMock } = await testUpdateEndpoint();
      expectApiError(responseMock);
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(500);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        success: false,
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        success: false,
      });
    });
  });

  describe('getTodoById', () => {
    const testGetEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.getTodoById,
        requestProps: {
          method: 'GET',
          params: {
            id: mockTodos[0].id,
          },
          headers: {
            ...getAuthHeader(mockUser.id),
          },
        },
      });

    it('responds with an API data response', async () => {
      vi.mocked(getById).mockResolvedValue(mockTodos[0]);

      const { responseMock, loggerMock } = await testGetEndpoint();
      expectApiDataResponse(responseMock, { ...mockTodos[0] });
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

    it('responds with an API error response', async () => {
      vi.mocked(getById).mockRejectedValue(new Error('Database error'));

      const { responseMock, loggerMock } = await testGetEndpoint();
      expectApiError(responseMock);
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(500);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        success: false,
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        success: false,
      });
    });
  });

  describe('deleteTodoById', () => {
    const testGetEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.deleteTodoById,
        requestProps: {
          method: 'DELETE',
          params: {
            id: mockTodos[0].id,
          },
          headers: {
            ...getAuthHeader(mockUser.id),
          },
        },
      });

    it('responds with an API data response', async () => {
      vi.mocked(deleteById).mockResolvedValue(mockTodos[0]);

      const { responseMock, loggerMock } = await testGetEndpoint();
      expectApiDataResponse(responseMock, { ...mockTodos[0] });
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

    it('responds with an API error response', async () => {
      vi.mocked(deleteById).mockRejectedValue(new Error('Database error'));

      const { responseMock, loggerMock } = await testGetEndpoint();
      expectApiError(responseMock);
      expect(loggerMock._getLogs().error).toHaveLength(1);
      expect(responseMock._getStatusCode()).toBe(500);
      expect(mockedMetrics.createCounter).toHaveBeenCalled();
      expect(mockedMetrics.createTimer).toHaveBeenCalled();
      expect(mockedCounter.add).toHaveBeenCalledWith(1, {
        success: false,
      });
      expect(mockedTimer.record).toHaveBeenCalledWith(expect.any(Number), {
        success: false,
      });
    });
  });
});
