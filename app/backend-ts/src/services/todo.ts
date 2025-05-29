import { cacheKey, create, deleteById, getAll, getById, updateById } from '@/models/todo';
import type { ContextKind, CreateTodoModel, Todo, TodoQueryField, UpdateTodoModel } from '@/types';
import { Api, PubSub, State, type ServiceParams } from '@sos/sdk';

const pubSubName = PubSub.PubSubNames.REDIS;
const pubSubTopic = 'todo-data';
const stateName = State.StateNames.REDIS;

export const getAllTodo = async (args: {
  serviceParams: ServiceParams<void, ContextKind>;
  queryParams?: Api.QueryParams<TodoQueryField>;
}): Promise<Api.PaginatedQueryResults<Todo, TodoQueryField>> => {
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
    // Delete the todo item from the state store, causing the read-through cache to be invalidated.
    await State.destroy({ context, stateName, key: cacheKey(stateName, payload.id) });
    // Publish the created todo item to the specified topic for downstream subscribers to consume.
    await PubSub.publish<Todo, ContextKind>({ context, pubSubName, pubSubTopic, data: payload });
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

  // Read-through cache pattern: When another service requests the todo item, it first checks the state store.
  // If the item is not found, it fetches it from this service which saves it to the state store for future requests.
  await State.save({
    context,
    stateName,
    stateObjects: [{ key: cacheKey(stateName, todo.id), value: todo }],
  }).catch((error) => {
    context.logger.error({ error }, `Failed to save todo to statestore: ${stateName}`);
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
    // Delete the todo item from the state store, causing the read-through cache to be invalidated.
    await State.destroy({ context, stateName, key: cacheKey(stateName, payload.id) });
    // Publish the updated todo item to the specified topic for downstream subscribers to consume.
    await PubSub.publish<Todo, ContextKind>({ context, pubSubName, pubSubTopic, data: payload });
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
    // Delete the todo item from the state store, causing the read-through cache to be invalidated.
    await State.destroy({ context, stateName, key: cacheKey(stateName, payload.id) });
    // Publish the deleted todo item to the specified topic for downstream subscribers to consume.
    await PubSub.publish<Todo, ContextKind>({ context, pubSubName, pubSubTopic, data: payload });
    await trx.commit();
    return payload;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};
