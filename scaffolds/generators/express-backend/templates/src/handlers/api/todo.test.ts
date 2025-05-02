import { buildServiceContext } from '@/lib/shared/context';
import * as Metrics from '@/lib/shared/metrics';
import type { Context, ContextConfig } from '@/lib/shared/types';
import { buildPaginatedTodos } from '@/lib/test/models/todo';
import { expectApiDataResponse, expectApiError, getAuthHeader } from '@/lib/test/utils';
import {
  createTodo,
  deleteTodoById,
  getAllTodo,
  getTodoById,
  updateTodoById,
} from '@/services/todo';
import * as UserService from '@/services/user';
import type { ContextKind, Todo } from '@/types';
import { testEndpoint } from 'express-zod-api';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import * as todoHandlers from './todo';

vi.mock('@/services/todo');
vi.mock('@/services/user');

// Mocked in vitest.setup.ts
const mockedUserService = UserService as Mocked<typeof UserService>;
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

  let mockedContext: Mocked<Context<ContextKind>>;
  let mockedCounter: Mocked<ReturnType<typeof mockedMetrics.createCounter>>;
  let mockedTimer: Mocked<ReturnType<typeof mockedMetrics.createTimer>>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockedContext = (await buildServiceContext({} as ContextConfig<ContextKind>)) as Mocked<
      Context<ContextKind>
    >;
    mockedUserService.getUser.mockResolvedValue({ user: { id: mockUser.id } });
    mockedMetrics.createCounter.mockReturnValue({ add: vi.fn() });
    mockedMetrics.createTimer.mockReturnValue({ record: vi.fn() });
    mockedCounter = mockedMetrics.createCounter(mockedContext) as Mocked<
      ReturnType<typeof mockedMetrics.createCounter>
    >;
    mockedTimer = mockedMetrics.createTimer(mockedContext) as Mocked<
      ReturnType<typeof mockedMetrics.createTimer>
    >;
  });

  describe('getAllTodo', () => {
    const testGetAllEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.getAllTodo(mockedContext),
        requestProps: {
          method: 'GET',
          headers: {
            ...getAuthHeader(mockUser.id),
          },
        },
      });

    it('responds with an API data response', async () => {
      const paginatedTodos = buildPaginatedTodos({
        orderBy: 'title',
        orderDirection: 'asc',
        page: 2,
        pageSize: 5,
      });
      vi.mocked(getAllTodo).mockResolvedValue(paginatedTodos);

      const { responseMock, loggerMock } = await testGetAllEndpoint();
      expectApiDataResponse(responseMock, paginatedTodos);
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
      vi.mocked(getAllTodo).mockRejectedValue(new Error('Database error'));

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
        endpoint: todoHandlers.createTodo(mockedContext),
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
      vi.mocked(createTodo).mockResolvedValue(mockTodos[0]);

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
      vi.mocked(createTodo).mockRejectedValue(new Error('Database error'));

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
    const testUpdateEndpoint = async (method: 'PUT' | 'PATCH') =>
      testEndpoint({
        endpoint: todoHandlers.updateTodoById(mockedContext),
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

    describe('using HTTP PUT', () => {
      it('responds with an API data response', async () => {
        vi.mocked(updateTodoById).mockResolvedValue({ ...mockTodos[0], completed: false });

        const { responseMock, loggerMock } = await testUpdateEndpoint('PUT');
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
        vi.mocked(updateTodoById).mockRejectedValue(new Error('Database error'));

        const { responseMock, loggerMock } = await testUpdateEndpoint('PUT');
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

    describe('using HTTP PATCH', () => {
      it('responds with an API data response', async () => {
        vi.mocked(updateTodoById).mockResolvedValue({ ...mockTodos[0], completed: false });

        const { responseMock, loggerMock } = await testUpdateEndpoint('PATCH');
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
        vi.mocked(updateTodoById).mockRejectedValue(new Error('Database error'));

        const { responseMock, loggerMock } = await testUpdateEndpoint('PATCH');
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

  describe('getTodoById', () => {
    const testGetEndpoint = async () =>
      testEndpoint({
        endpoint: todoHandlers.getTodoById(mockedContext),
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
      vi.mocked(getTodoById).mockResolvedValue(mockTodos[0]);

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
      vi.mocked(getTodoById).mockRejectedValue(new Error('Database error'));

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
        endpoint: todoHandlers.deleteTodoById(mockedContext),
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
      vi.mocked(deleteTodoById).mockResolvedValue(mockTodos[0]);

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
      vi.mocked(deleteTodoById).mockRejectedValue(new Error('Database error'));

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
