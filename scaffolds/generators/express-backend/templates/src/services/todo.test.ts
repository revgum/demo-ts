import { context } from '@/lib/context';
import * as PubSub from '@/lib/shared/pubsub';
import { buildMockDbChain } from '@/lib/test/db';
import { buildTodos } from '@/lib/test/models/todo';
import { logger } from '@/lib/test/utils';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import { type Todo } from '@/types';
import type { Knex } from 'knex';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import { createTodo, deleteTodoById, getAllTodo, getTodoById, updateTodoById } from './todo';

vi.mock('@/models/todo');
vi.mock('@/lib/shared/pubsub');

describe('Todo Service', () => {
  const mockedContext = context as Mocked<typeof context>;

  let mockedTransaction: Mocked<Knex.Transaction>;
  let todo: Todo;
  let mockedPubSub: Mocked<typeof PubSub>;

  beforeEach(() => {
    vi.clearAllMocks();

    [{ todo }] = buildTodos();
    mockedTransaction = buildMockDbChain() as unknown as Mocked<Knex.Transaction>;
    mockedContext.db.transaction = vi.fn().mockResolvedValue(mockedTransaction);
    mockedPubSub = PubSub as Mocked<typeof PubSub>;
  });

  describe('getAllTodo', () => {
    it('returns an array of records mapped to models', async () => {
      vi.mocked(getAll).mockResolvedValue([todo]);
      const result = await getAllTodo({ context: mockedContext, logger });
      expect(result).toEqual([todo]);
    });
    it('throws an unhandled error', async () => {
      vi.mocked(getAll).mockRejectedValue(new Error('Database error'));
      await expect(() => getAllTodo({ context: mockedContext, logger })).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('createTodo', () => {
    it('returns a record mapped to the model', async () => {
      vi.mocked(create).mockResolvedValue(todo);
      const result = await createTodo({ context: mockedContext, logger, input: todo });
      expect(result).toEqual(todo);
      expect(mockedTransaction.commit).toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).toHaveBeenCalled();
    });
    it('throws an error before the transaction is started if input is not provided', async () => {
      await expect(() => createTodo({ context: mockedContext, logger })).rejects.toThrow(
        'Create todo input is missing.',
      );
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(create).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        createTodo({ context: mockedContext, logger, input: todo }),
      ).rejects.toThrow('Database error');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
    });
  });

  describe('getTodoById', () => {
    it('returns a record mapped to model', async () => {
      vi.mocked(getById).mockResolvedValue(todo);
      const result = await getTodoById({ context: mockedContext, logger, input: todo.id });
      expect(result).toEqual(todo);
    });
    it('throws an error if input is not provided', async () => {
      await expect(() => getTodoById({ context: mockedContext, logger })).rejects.toThrow(
        'Todo ID is missing.',
      );
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(getById).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        getTodoById({ context: mockedContext, logger, input: todo.id }),
      ).rejects.toThrow('Database error');
    });
  });

  describe('updateTodoById', () => {
    it('returns a record mapped to the model', async () => {
      vi.mocked(updateById).mockResolvedValue(todo);
      const result = await updateTodoById({ context: mockedContext, logger, input: todo });
      expect(result).toEqual(todo);
      expect(mockedTransaction.commit).toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).toHaveBeenCalled();
    });
    it('throws an error before the transaction is started if input is not provided', async () => {
      await expect(() => updateTodoById({ context: mockedContext, logger })).rejects.toThrow(
        'Update todo input is missing.',
      );
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(updateById).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        updateTodoById({ context: mockedContext, logger, input: todo }),
      ).rejects.toThrow('Database error');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
    });
  });

  describe('deleteTodoById', () => {
    it('returns a record mapped to the model', async () => {
      vi.mocked(deleteById).mockResolvedValue(todo);
      const result = await deleteTodoById({ context: mockedContext, logger, input: todo.id });
      expect(result).toEqual(todo);
      expect(mockedTransaction.commit).toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).toHaveBeenCalled();
    });
    it('throws an error before the transaction is started if input is not provided', async () => {
      await expect(() => deleteTodoById({ context: mockedContext, logger })).rejects.toThrow(
        'Todo ID is missing.',
      );
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).not.toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
    });
    it('throws an unhandled error', async () => {
      vi.mocked(deleteById).mockRejectedValue(new Error('Database error'));
      await expect(() =>
        deleteTodoById({ context: mockedContext, logger, input: todo.id }),
      ).rejects.toThrow('Database error');
      expect(mockedTransaction.commit).not.toHaveBeenCalled();
      expect(mockedTransaction.rollback).toHaveBeenCalled();
      expect(mockedPubSub.publish).not.toHaveBeenCalled();
    });
  });
});
