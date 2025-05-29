import { create } from '@/models/todo';
import {
  ContextKinds,
  type ContextKind,
  type Todo,
  type TodoDb,
  type TodoQueryField,
} from '@/types';
import { Api, type Context } from '@sos/sdk';
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
      ...overrides,
    };
    const todo: Todo = {
      id: todoDb.id,
      title: todoDb.title,
      kind: ContextKinds.TODO,
      createdAt: todoDb.created_at.toISOString(),
      completed: todoDb.completed,
    };

    // Optional ("undefined") fields are not serialized to the model
    if (todoDb.due_at) todo.dueAt = todoDb.due_at.toISOString();
    if (todoDb.deleted_at) todo.deletedAt = todoDb.deleted_at.toISOString();
    if (todoDb.updated_at) todo.updatedAt = todoDb.updated_at.toISOString();

    todos.push({ todoDb, todo });
  }
  return todos;
};

export const buildPaginatedTodos = (args: {
  pageSize: number;
  page: number;
  orderBy: TodoQueryField;
  orderDirection: Api.QueryOrderDirection;
}): Api.PaginatedQueryResults<Todo, TodoQueryField> => {
  const { pageSize, page, orderBy, orderDirection } = args;

  const todos = buildTodos({}, pageSize * page);
  const items = todos
    .map(({ todo }) => {
      return todo;
    })
    .slice(0, pageSize);

  return {
    items,
    currentItemCount: items.length,
    itemsPerPage: pageSize,
    orderBy,
    orderDirection,
    pageIndex: page,
    totalItems: todos.length,
    totalPages: Math.ceil(todos.length / pageSize),
  };
};

export const createTodos = async (
  context: Context<ContextKind>,
  overrides: Partial<TodoDb> = {},
  count = 1,
): Promise<Array<{ todoDb: TodoDb; todo: Todo }>> => {
  const todos = buildTodos(overrides, count);
  const trx = await context.db.transaction();
  for await (const t of todos) {
    t.todo = await create(context, trx, t.todo);
  }
  await trx.commit();

  return todos;
};
