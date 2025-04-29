import { context } from '@/lib/context';
import { buildMockDbChain } from '@/lib/test/db';
import { buildTodos } from '@/lib/test/models/todo';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import { type Todo, type TodoDb } from '@/types';
import type { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import { afterEach } from 'node:test';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

describe('Todo Model', () => {
  const now = new Date();
  vi.useFakeTimers().setSystemTime(now);

  const mockedContext = context as Mocked<typeof context>;
  const invalidId = randomUUID();

  let mockedTransaction: Mocked<Knex.Transaction>;
  let mockDbChain: Mocked<Knex.QueryBuilder>;
  let todoDb: TodoDb;
  let todo: Todo;

  beforeEach(() => {
    [{ todo, todoDb }] = buildTodos();
    mockDbChain = buildMockDbChain();
    mockedTransaction = vi.fn().mockReturnValue(mockDbChain) as unknown as Mocked<Knex.Transaction>;
    mockedContext.db.mockImplementation(
      () => mockDbChain as unknown as ReturnType<typeof mockedContext.db>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns an array of paginated records mapped to models using default query parameters', async () => {
      mockDbChain.returning.mockResolvedValue([todoDb]);
      mockDbChain.first.mockResolvedValue({ count: 1 });
      const result = await getAll(mockedContext);
      expect(result).toEqual({
        currentItemCount: 1,
        itemsPerPage: 50,
        orderBy: 'created_at',
        orderDirection: 'desc',
        pageIndex: 1,
        totalItems: 1,
        totalPages: 1,
        items: [todo],
      });
      expect(mockDbChain.where).toHaveBeenCalledWith('deleted_at', null);
    });
    it('returns an array of paginated records mapped to models', async () => {
      // Mock the result set with query params filters applied
      mockDbChain.returning.mockResolvedValue([todoDb, todoDb]);
      // Mock the count of the full result set as if the database had many more records
      mockDbChain.first.mockResolvedValue({ count: 3000 });
      const result = await getAll(mockedContext, {
        pageSize: 2,
        page: 2,
        orderBy: 'title',
        orderDirection: 'asc',
      });
      expect(result).toEqual({
        currentItemCount: 2,
        itemsPerPage: 2,
        orderBy: 'title',
        orderDirection: 'asc',
        pageIndex: 2,
        totalItems: 3000,
        totalPages: 1500,
        items: [todo, todo],
      });
      expect(mockDbChain.where).toHaveBeenCalledWith('deleted_at', null);
      expect(mockDbChain.offset).toHaveBeenCalledWith(2);
      expect(mockDbChain.limit).toHaveBeenCalledWith(2);
      expect(mockDbChain.orderBy).toHaveBeenCalledWith('title', 'asc');
    });
    it('throws an unhandled error', async () => {
      mockDbChain.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => getAll(mockedContext)).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('returns a record mapped to the model', async () => {
      mockDbChain.returning.mockResolvedValue([todoDb]);
      const result = await getById(mockedContext, todoDb.id);
      expect(result).toEqual(todo);
      expect(mockDbChain.where).toHaveBeenCalledWith({ id: todoDb.id, deleted_at: null });
    });
    it('throws an error when the record is not found', async () => {
      mockDbChain.returning.mockResolvedValue([]);
      await expect(() => getById(mockedContext, invalidId)).rejects.toThrow(
        `Todo ${invalidId} not found.`,
      );
    });
    it('throws an unhandled error', async () => {
      mockDbChain.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => getById(mockedContext, invalidId)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('returns a record mapped to the model', async () => {
      mockDbChain.returning.mockResolvedValue([todoDb]);
      const result = await create(mockedContext, mockedTransaction, todoDb);
      expect(result).toEqual(todo);
      expect(mockDbChain.insert).toHaveBeenCalledWith({
        id: expect.any(String),
        title: todoDb.title,
        completed: todoDb.completed,
        due_at: todoDb.due_at ?? null,
        created_at: todoDb.created_at,
      });
    });
    it('throws an error when the record is not returned from the database', async () => {
      mockDbChain.returning.mockResolvedValue([]);
      await expect(() => create(mockedContext, mockedTransaction, todoDb)).rejects.toThrow(
        `Created Todo not returned.`,
      );
    });
    it('throws an unhandled error', async () => {
      mockDbChain.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => create(mockedContext, mockedTransaction, todoDb)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('updateById', () => {
    it('returns a record mapped to the model', async () => {
      mockDbChain.returning.mockResolvedValue([todoDb]);
      const result = await updateById(mockedContext, mockedTransaction, todoDb.id, todoDb);
      expect(result).toEqual(todo);
      expect(mockDbChain.where).toHaveBeenCalledWith({ id: todoDb.id });
      expect(mockDbChain.update).toHaveBeenCalledWith({
        title: todoDb.title,
        completed: todoDb.completed,
        due_at: todoDb.due_at ?? null,
        updated_at: now,
      });
    });
    it('throws an error when the record is not returned from the database', async () => {
      mockDbChain.returning.mockResolvedValueOnce([todoDb]);
      mockDbChain.returning.mockResolvedValue([]);
      await expect(() =>
        updateById(mockedContext, mockedTransaction, todoDb.id, todoDb),
      ).rejects.toThrow(`Updated Todo ${todoDb.id} not returned.`);
    });
    it('throws an unhandled error', async () => {
      mockDbChain.returning.mockRejectedValue(new Error('Database error'));
      await expect(() =>
        updateById(mockedContext, mockedTransaction, todoDb.id, todoDb),
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteById', () => {
    it('returns a record mapped to the model', async () => {
      mockDbChain.returning.mockResolvedValue([todoDb]);
      const result = await deleteById(mockedContext, mockedTransaction, todoDb.id);
      expect(result).toEqual(todo);
      expect(mockDbChain.where).toHaveBeenCalledWith({ id: todoDb.id, deleted_at: null });
      expect(mockDbChain.update).toHaveBeenCalledWith({
        deleted_at: now,
      });
    });
    it('throws an error when the record is not returned from the database', async () => {
      mockDbChain.returning.mockResolvedValue([]);
      await expect(() => deleteById(mockedContext, mockedTransaction, todoDb.id)).rejects.toThrow(
        `Todo ${todoDb.id} not found.`,
      );
    });
    it('throws an unhandled error', async () => {
      mockDbChain.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => deleteById(mockedContext, mockedTransaction, todoDb.id)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
