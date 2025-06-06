import { TodoQueryFields } from '@/schemas/todo';
import type {
  ContextKind,
  CreateTodoModel,
  Todo,
  TodoDb,
  TodoQueryField,
  UpdateTodoModel,
} from '@/types';
import { Api, State, type Context } from '@sos/sdk';
import createHttpError from 'http-errors';
import type { Knex } from 'knex';
import { randomUUID } from 'node:crypto';

export const TABLE_NAME = 'todo';

export const cacheKey = (stateName: State.StateName, id: string) =>
  `${stateName}:${TABLE_NAME}:${id}`;

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

export const getAll = async (
  context: Context<ContextKind>,
  queryParams?: Api.QueryParams<TodoQueryField>,
): Promise<Api.PaginatedQueryResults<Todo, TodoQueryField>> => {
  const totalCountResult = await context
    .db<TodoDb>(TABLE_NAME)
    .where('deleted_at', null)
    .count<{ count: number }>('id as count')
    .first();

  const totalItems = Number.parseInt(totalCountResult?.count.toString() ?? '0');
  const { page, pageSize, orderBy, orderDirection, offset, totalPages } = Api.getQueryParams(
    TodoQueryFields,
    queryParams,
    totalItems,
  );

  const rows = await context
    .db<TodoDb>(TABLE_NAME)
    .where('deleted_at', null)
    .orderBy(orderBy, orderDirection)
    .offset(offset)
    .limit(pageSize)
    .returning<TodoDb[]>('*');

  return {
    orderBy,
    orderDirection,
    pageIndex: page,
    totalPages,
    itemsPerPage: pageSize,
    totalItems,
    currentItemCount: rows.length,
    items: rows.map(asModel),
  };
};

export const getById = async (context: Context<ContextKind>, id: Todo['id']): Promise<Todo> => {
  const rows = await context
    .db<TodoDb>(TABLE_NAME)
    .where({ id, deleted_at: null })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw createHttpError(404, `Todo ${id} not found.`);
  }

  return asModel(rows[0]);
};

export const create = async (
  _context: Context<ContextKind>,
  trx: Knex.Transaction,
  input: Partial<CreateTodoModel>,
): Promise<Todo> => {
  const due_at = input.dueAt ? new Date(input.dueAt) : null;
  const rows = await trx<TodoDb>(TABLE_NAME)
    .insert({
      id: randomUUID(),
      title: input.title,
      completed: input.completed ?? false,
      due_at,
      created_at: new Date(),
    })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw createHttpError(400, 'Created Todo not returned.');
  }

  return asModel(rows[0]);
};

export const updateById = async (
  context: Context<ContextKind>,
  trx: Knex.Transaction,
  id: Todo['id'],
  input: Partial<UpdateTodoModel>,
): Promise<Todo> => {
  const todo = await getById(context, id);
  const { title, completed, dueAt } = input;

  const rows = await trx<TodoDb>(TABLE_NAME)
    .where({ id })
    .update({
      title: title ?? todo.title,
      completed: completed ?? todo.completed ?? false,
      due_at: dueAt ? new Date(dueAt) : todo.dueAt ? new Date(todo.dueAt) : null,
      updated_at: new Date(),
    })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw createHttpError(400, `Updated Todo ${id} not returned.`);
  }

  return asModel(rows[0]);
};

export const deleteById = async (
  _context: Context<ContextKind>,
  trx: Knex.Transaction,
  id: Todo['id'],
): Promise<Todo> => {
  const rows = await trx<TodoDb>(TABLE_NAME)
    .where({ id, deleted_at: null })
    .update({
      deleted_at: new Date(),
    })
    .returning<TodoDb[]>('*');

  if (!rows.length) {
    throw createHttpError(404, `Todo ${id} not found.`);
  }

  return asModel(rows[0]);
};
