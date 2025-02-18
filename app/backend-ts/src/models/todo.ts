import { randomUUID } from 'node:crypto';
import type { Context, Todo } from '../types';

export const TABLE_NAME = 'todo';

export const getAll = async (context: Context): Promise<Todo[]> => context.db<Todo>(TABLE_NAME).whereNull('deleted_at');

export const getById = async (context: Context, id: Todo['id']): Promise<Todo> => {
  const rows = await context.db<Todo>(TABLE_NAME).where({ id }).whereNull('deleted_at');

  if (!rows.length) {
    throw new Error(`Todo ${id} not found.`);
  }

  return rows[0];
};

export const create = async (context: Context, obj: Partial<Todo>): Promise<Todo> => {
  const due_at = obj.due_at ? new Date(obj.due_at).toUTCString() : null;
  const rows = await context
    .db<Todo>(TABLE_NAME)
    .insert({
      id: randomUUID(),
      title: obj.title,
      completed: obj.completed,
      due_at,
      created_at: new Date().toUTCString(),
    })
    .returning<Todo[]>('*');

  if (!rows.length) {
    throw new Error('New todo record not returned.');
  }

  return rows[0];
};

export const updateById = async (context: Context, id: Todo['id'], obj: Partial<Todo>): Promise<Todo> => {
  const todo = await getById(context, id);
  const { title, completed, due_at } = obj;

  const rows = await context
    .db<Todo>(TABLE_NAME)
    .where({ id })
    .update({
      title: title ?? todo.title,
      completed: completed ?? todo.completed,
      due_at: due_at ?? todo.due_at,
      updated_at: new Date().toUTCString(),
    })
    .returning<Todo[]>('*');

  if (!rows.length) {
    throw new Error('Updated todo record not returned.');
  }

  return rows[0];
};

export const deleteById = async (context: Context, id: Todo['id']): Promise<Todo> => {
  const rows = await context
    .db<Todo>(TABLE_NAME)
    .where({ id })
    .whereNull('deleted_at')
    .update({
      deleted_at: new Date().toUTCString(),
    })
    .returning<Todo[]>('*');

  if (!rows.length) {
    throw new Error('Deleted todo record not returned.');
  }

  return rows[0];
};
