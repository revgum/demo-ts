import { context } from '@/context';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import { ContextKinds, type Todo, type TodoDb } from '@/types';
import { randomUUID } from 'node:crypto';
import { afterEach } from 'node:test';
import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';

vi.mock('@/context', () => {
  return {
    context: {
      db: vi.fn(),
    },
  };
});

describe('Todo Model', () => {
  const buildTodos = (
    overrides: Partial<TodoDb> = {},
    count = 1,
  ): Array<{ todoDb: TodoDb; todo: Todo }> => {
    const todos = [];
    for (let i = 0; i < count; i++) {
      const todoDb = {
        id: randomUUID(),
        title: 'Test Todo',
        created_at: new Date(),
        completed: true,
        due_at: undefined,
        deleted_at: undefined,
        updated_at: undefined,
        ...overrides,
      };
      todos.push({
        todoDb,
        todo: {
          id: todoDb.id,
          title: todoDb.title,
          kind: ContextKinds.TODO,
          createdAt: todoDb.created_at.toISOString(),
          completed: todoDb.completed,
          dueAt: todoDb.due_at?.toISOString() ?? undefined,
          deletedAt: todoDb.deleted_at?.toISOString() ?? undefined,
          updatedAt: todoDb.updated_at?.toISOString() ?? undefined,
        },
      });
    }
    return todos;
  };

  const invalidId = randomUUID();

  const mockedContext = context as Mocked<typeof context>;
  let mockedDb: Mocked<ReturnType<typeof mockedContext.db>>;

  beforeEach(() => {
    const mockDbChain = {
      where: vi.fn().mockImplementation(() => mockDbChain),
      andWhere: vi.fn().mockImplementation(() => mockDbChain),
      update: vi.fn().mockImplementation(() => mockDbChain),
      insert: vi.fn().mockImplementation(() => mockDbChain),
      returning: vi.fn().mockImplementation(() => mockDbChain),
    };

    mockedContext.db.mockImplementation(
      () => mockDbChain as unknown as ReturnType<typeof mockedContext.db>,
    );
    mockedDb = mockedContext.db() as Mocked<ReturnType<typeof mockedContext.db>>;
  });

  describe('getAll', () => {
    const [{ todo, todoDb }] = buildTodos();
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('returns an array of records mapped to models', async () => {
      mockedDb.returning.mockResolvedValue([todoDb]);
      const result = await getAll(mockedContext);
      expect(result).toEqual([todo]);
      expect(mockedDb.where).toHaveBeenCalledWith('deleted_at', null);
    });
    it('throws an unhandled error', async () => {
      mockedDb.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => getAll(mockedContext)).rejects.toThrow('Database error');
    });
  });

  describe('getById', () => {
    const [{ todo, todoDb }] = buildTodos();
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('returns a record mapped to the model', async () => {
      mockedDb.returning.mockResolvedValue([todoDb]);
      const result = await getById(mockedContext, todoDb.id);
      expect(result).toEqual(todo);
      expect(mockedDb.where).toHaveBeenCalledWith({ id: todoDb.id, deleted_at: null });
    });
    it('throws an error when the record is not found', async () => {
      mockedDb.returning.mockResolvedValue([]);
      await expect(() => getById(mockedContext, invalidId)).rejects.toThrow(
        `Todo ${invalidId} not found.`,
      );
    });
    it('throws an unhandled error', async () => {
      mockedDb.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => getById(mockedContext, invalidId)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('returns a record mapped to the model', async () => {
      const [{ todo, todoDb }] = buildTodos();
      mockedDb.returning.mockResolvedValue([todoDb]);
      const result = await create(mockedContext, todoDb);
      expect(result).toEqual(todo);
      expect(mockedDb.insert).toHaveBeenCalledWith({
        id: expect.any(String),
        title: todoDb.title,
        completed: todoDb.completed,
        due_at: todoDb.due_at ?? null,
        created_at: todoDb.created_at,
      });
    });
    it('throws an error when the record is not returned from the database', async () => {
      const [{ todoDb }] = buildTodos();
      mockedDb.returning.mockResolvedValue([]);
      await expect(() => create(mockedContext, todoDb)).rejects.toThrow(
        `Created Todo not returned.`,
      );
    });
    it('throws an unhandled error', async () => {
      const [{ todoDb }] = buildTodos();
      mockedDb.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => create(mockedContext, todoDb)).rejects.toThrow('Database error');
    });
  });

  describe('updateById', () => {
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('returns a record mapped to the model', async () => {
      const [{ todo, todoDb }] = buildTodos();
      const now = new Date();
      vi.useFakeTimers().setSystemTime(now);
      mockedDb.returning.mockResolvedValue([todoDb]);
      const result = await updateById(mockedContext, todoDb.id, todoDb);
      expect(result).toEqual(todo);
      expect(mockedDb.where).toHaveBeenCalledWith({ id: todoDb.id });
      expect(mockedDb.update).toHaveBeenCalledWith({
        title: todoDb.title,
        completed: todoDb.completed,
        due_at: todoDb.due_at ?? null,
        updated_at: now,
      });
    });
    it('throws an error when the record is not returned from the database', async () => {
      const [{ todoDb }] = buildTodos();
      mockedDb.returning.mockResolvedValueOnce([todoDb]);
      mockedDb.returning.mockResolvedValue([]);
      await expect(() => updateById(mockedContext, todoDb.id, todoDb)).rejects.toThrow(
        `Updated Todo ${todoDb.id} not returned.`,
      );
    });
    it('throws an unhandled error', async () => {
      const [{ todoDb }] = buildTodos();
      mockedDb.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => updateById(mockedContext, todoDb.id, todoDb)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('deleteById', () => {
    const [{ todo, todoDb }] = buildTodos();
    afterEach(() => {
      vi.resetAllMocks();
    });
    it('returns a record mapped to the model', async () => {
      const now = new Date();
      vi.useFakeTimers().setSystemTime(now);
      mockedDb.returning.mockResolvedValue([todoDb]);
      const result = await deleteById(mockedContext, todoDb.id);
      expect(result).toEqual(todo);
      expect(mockedDb.where).toHaveBeenCalledWith({ id: todoDb.id, deleted_at: null });
      expect(mockedDb.update).toHaveBeenCalledWith({
        deleted_at: now,
      });
    });
    it('throws an error when the record is not returned from the database', async () => {
      mockedDb.returning.mockResolvedValue([]);
      await expect(() => deleteById(mockedContext, todoDb.id)).rejects.toThrow(
        `Todo ${todoDb.id} not found.`,
      );
    });
    it('throws an unhandled error', async () => {
      mockedDb.returning.mockRejectedValue(new Error('Database error'));
      await expect(() => deleteById(mockedContext, todoDb.id)).rejects.toThrow('Database error');
    });
  });
});
