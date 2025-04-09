import { randomUUID } from 'node:crypto';
import type { Context, CreateTodoModel, Todo, TodoDb, UpdateTodoModel } from '@/types';

export const TABLE_NAME = 'todo';

const asModel = (item: TodoDb): Todo => {
  return {
    id: item.id,
    kind: 'todo',
    completed: item.completed,
    createdAt: item.created_at.toISOString(),
    deletedAt: item.deleted_at?.toISOString(),
    dueAt: item.due_at?.toISOString(),
    title: item.title,
    updatedAt: item.updated_at?.toISOString(),
  };
};

export const getAll = async (context: Context): Promise<Todo[]> => {
  const rows = await context.db<TodoDb>(TABLE_NAME).whereNull('deleted_at');
  return rows.map(asModel);
};

export const getById = async (context: Context, id: Todo['id']): Promise<Todo> => {
  const rows = await context.db<TodoDb>(TABLE_NAME).where({ id }).whereNull('deleted_at');

  if (!rows.length) {
    throw new Error(`Todo ${id} not found.`);
  }

  return asModel(rows[0]);
};

export const create = async (context: Context, obj: Partial<CreateTodoModel>): Promise<Todo> => {
  const due_at = obj.dueAt ? new Date(obj.dueAt) : null;
  const rows = await context
    .db<TodoDb>(TABLE_NAME)
    .insert({
      id: randomUUID(),
      title: obj.title,
      completed: obj.completed ?? false,
      due_at,
      created_at: new Date(),
    })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw new Error('New todo record not returned.');
  }

  return asModel(rows[0]);
};

export const updateById = async (context: Context, id: Todo['id'], obj: Partial<UpdateTodoModel>): Promise<Todo> => {
  const todo = await getById(context, id);
  const { title, completed, dueAt } = obj;

  const rows = await context
    .db<TodoDb>(TABLE_NAME)
    .where({ id })
    .update({
      title: title ?? todo.title,
      completed: completed ?? todo.completed ?? false,
      due_at: dueAt ? new Date(dueAt) : todo.dueAt ? new Date(todo.dueAt) : null,
      updated_at: new Date(),
    })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw new Error('Updated todo record not returned.');
  }

  return asModel(rows[0]);
};

export const deleteById = async (context: Context, id: Todo['id']): Promise<Todo> => {
  const rows = await context
    .db<TodoDb>(TABLE_NAME)
    .where({ id })
    .whereNull('deleted_at')
    .update({
      deleted_at: new Date(),
    })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw new Error('Deleted todo record not returned.');
  }

  return asModel(rows[0]);
};
