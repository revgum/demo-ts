import type { PaginatedQueryResults, QueryParams } from '@/lib/shared/api';
import { publish, PubSubNames } from '@/lib/shared/pubsub';
import { destroy, save, StateNames } from '@/lib/shared/state';
import type { ServiceParams } from '@/lib/shared/types';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import type { ContextKind, CreateTodoModel, Todo, TodoQueryField, UpdateTodoModel } from '@/types';

const pubSubName = PubSubNames.REDIS;
const pubSubTopic = 'todo-data';

export const getAllTodo = async (args: {
  serviceParams: ServiceParams<void, ContextKind>;
  queryParams?: QueryParams<TodoQueryField>;
}): Promise<PaginatedQueryResults<Todo, TodoQueryField>> => {
  const {
    serviceParams: { context },
    queryParams,
  } = args;
  const { items, ...rest } = await getAll(context, queryParams);
  context.logger.info({ ...rest });
  return {
    items,
    ...rest,
  };
};

export const createTodo = async ({
  context,
  input,
}: ServiceParams<CreateTodoModel, ContextKind>): Promise<Todo> => {
  if (!input) {
    throw new Error('Create todo input is missing.');
  }

  const trx = await context.db.transaction();
  try {
    const payload = await create(context, trx, input);
    await destroy({ context, stateName: StateNames.REDIS, id: payload.id });
    await publish<Todo, ContextKind>({ context, pubSubName, pubSubTopic, data: payload });
    await trx.commit();
    return payload;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const getTodoById = async ({
  context,
  input,
}: ServiceParams<Todo['id'], ContextKind>): Promise<Todo> => {
  if (!input) {
    throw new Error('Todo ID is missing.');
  }
  const todo = await getById(context, input);

  await save({
    context,
    stateName: StateNames.REDIS,
    stateObjects: [{ key: todo.id, value: todo }],
  }).catch((error) => {
    context.logger.error({ error }, `Failed to save todo to statestore: ${StateNames.REDIS}`);
  });

  return todo;
};

export const updateTodoById = async ({
  context,
  input,
}: ServiceParams<UpdateTodoModel & { id: Todo['id'] }, ContextKind>): Promise<Todo> => {
  if (!input) {
    throw new Error('Update todo input is missing.');
  }

  const trx = await context.db.transaction();
  try {
    const payload = await updateById(context, trx, input.id, input);
    await destroy({ context, stateName: StateNames.REDIS, id: payload.id });
    await publish<Todo, ContextKind>({ context, pubSubName, pubSubTopic, data: payload });
    await trx.commit();
    return payload;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

export const deleteTodoById = async ({
  context,
  input,
}: ServiceParams<Todo['id'], ContextKind>): Promise<Todo> => {
  if (!input) {
    throw new Error('Todo ID is missing.');
  }

  const trx = await context.db.transaction();
  try {
    const payload = await deleteById(context, trx, input);
    await destroy({ context, stateName: StateNames.REDIS, id: payload.id });
    await publish<Todo, ContextKind>({ context, pubSubName, pubSubTopic, data: payload });
    await trx.commit();
    return payload;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};
