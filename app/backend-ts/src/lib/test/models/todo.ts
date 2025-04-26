import { type Todo, type TodoDb, ContextKinds } from '@/types';
import { randomUUID } from 'crypto';

export const buildTodos = (
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
