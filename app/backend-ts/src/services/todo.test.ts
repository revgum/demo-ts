import { buildServiceContext } from '@/lib/shared/context';
import * as PubSub from '@/lib/shared/pubsub';
import * as State from '@/lib/shared/state';
import type { Context, ContextConfig } from '@/lib/shared/types';
import { buildMockDbChain } from '@/lib/test/db';
import { buildPaginatedTodos, buildTodos } from '@/lib/test/models/todo';
import { mockedLogger } from '@/lib/test/utils';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import { type ContextKind, type Todo } from '@/types';
import type { StateSaveResponseType } from '@dapr/dapr/types/state/StateSaveResponseType';
import type { Knex } from 'knex';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { createTodo, deleteTodoById, getAllTodo, getTodoById, updateTodoById } from './todo';

vi.mock('@/models/todo');
vi.mock('@/lib/shared/pubsub');
vi.mock('@/lib/shared/state');

describe('Todo Service', () => {
  let mockedContext: Mocked<Context<ContextKind>>;
  let mockedTransaction: Mocked<Knex.Transaction>;
  let todo: Todo;
  let mockedPubSub: Mocked<typeof PubSub>;
  let mockedState: Mocked<typeof State>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockedContext = (await buildServiceContext({} as ContextConfig<ContextKind>)) as Mocked<
      Context<ContextKind>
    >;
    [{ todo }] = buildTodos();
    mockedTransaction = buildMockDbChain() as unknown as Mocked<Knex.Transaction>;
    mockedContext.db.transaction = vi.fn().mockResolvedValue(mockedTransaction);
    mockedPubSub = PubSub as Mocked<typeof PubSub>;
    mockedState = State as Mocked<typeof State>;
    mockedState.save.mockResolvedValue(undefined as unknown as StateSaveResponseType);
  });

  describe('getAllTodo', () => {
    it('returns an array of records mapped to models', async () => {
      const paginatedTodos = buildPaginatedTodos({
        pageSize: 12,
        page: 3,
        orderBy: 'title',
        orderDirection: 'asc',
      });
      vi.mocked(getAll).mockResolvedValue(paginatedTodos);
      const result = await getAllTodo({
        serviceParams: { context: mockedContext, logger: mockedLogger },
        queryParams: {
          orderBy: 'title',
          orderDirection: 'asc',
          page: 3,
          pageSize: 12,
        },
      });
      expect(result).toEqual(paginatedTodos);
      expect(mockedLogger.info).toBeCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(getAll).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        getAllTodo({ serviceParams: { context: mockedContext, logger: mockedLogger } }),
      ).rejects.toThrow('Database error');
    });
  });

  describe('createTodo', () => {
    it('returns a record mapped to the model', async () => {
      vi.mocked(create).mockResolvedValue(todo);
      const result = await createTodo({
        context: mockedContext,
        logger: mockedLogger,
        input: todo,
      });
      expect(result).toEqual(todo);
      expect(mockedTransaction.commit).toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).toHaveBeenCalled();
      expect(mockedState.destroy).toHaveBeenCalled();
    });
    it('throws an error before the transaction is started if input is not provided', async () => {
      await expect(() =>
        createTodo({ context: mockedContext, logger: mockedLogger }),
      ).rejects.toThrow('Create todo input is missing.');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
      expect(mockedState.destroy).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(create).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        createTodo({ context: mockedContext, logger: mockedLogger, input: todo }),
      ).rejects.toThrow('Database error');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
      expect(mockedState.destroy).not.toHaveBeenCalled();
    });
  });

  describe('getTodoById', () => {
    it('returns a record mapped to model', async () => {
      vi.mocked(getById).mockResolvedValue(todo);
      const result = await getTodoById({
        context: mockedContext,
        logger: mockedLogger,
        input: todo.id,
      });
      expect(result).toEqual(todo);
      expect(mockedState.save).toHaveBeenCalled();
    });
    it('throws an error if input is not provided', async () => {
      await expect(() =>
        getTodoById({ context: mockedContext, logger: mockedLogger }),
      ).rejects.toThrow('Todo ID is missing.');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedState.save).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(getById).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        getTodoById({ context: mockedContext, logger: mockedLogger, input: todo.id }),
      ).rejects.toThrow('Database error');
      expect(mockedState.save).not.toHaveBeenCalled();
    });
  });

  describe('updateTodoById', () => {
    it('returns a record mapped to the model', async () => {
      vi.mocked(updateById).mockResolvedValue(todo);
      const result = await updateTodoById({
        context: mockedContext,
        logger: mockedLogger,
        input: todo,
      });
      expect(result).toEqual(todo);
      expect(mockedTransaction.commit).toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).toHaveBeenCalled();
      expect(mockedState.destroy).toHaveBeenCalled();
    });
    it('throws an error before the transaction is started if input is not provided', async () => {
      await expect(() =>
        updateTodoById({ context: mockedContext, logger: mockedLogger }),
      ).rejects.toThrow('Update todo input is missing.');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
      expect(mockedState.destroy).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(updateById).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        updateTodoById({ context: mockedContext, logger: mockedLogger, input: todo }),
      ).rejects.toThrow('Database error');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
      expect(mockedState.destroy).not.toHaveBeenCalled();
    });
  });

  describe('deleteTodoById', () => {
    it('returns a record mapped to the model', async () => {
      vi.mocked(deleteById).mockResolvedValue(todo);
      const result = await deleteTodoById({
        context: mockedContext,
        logger: mockedLogger,
        input: todo.id,
      });
      expect(result).toEqual(todo);
      expect(mockedTransaction.commit).toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).toHaveBeenCalled();
      expect(mockedState.destroy).toHaveBeenCalled();
    });
    it('throws an error before the transaction is started if input is not provided', async () => {
      await expect(() =>
        deleteTodoById({ context: mockedContext, logger: mockedLogger }),
      ).rejects.toThrow('Todo ID is missing.');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
      expect(mockedState.destroy).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(deleteById).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        deleteTodoById({ context: mockedContext, logger: mockedLogger, input: todo.id }),
      ).rejects.toThrow('Database error');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
      expect(mockedState.destroy).not.toHaveBeenCalled();
    });
  });
});
