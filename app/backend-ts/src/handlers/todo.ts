import { type DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import opentelemetry from '@opentelemetry/api';
import {
  create,
  deleteById as deleteTodoById,
  getAll,
  getById as getTodoById,
  updateById as updateTodoById,
} from '../models/todo';
import type { Context, ServiceRoutes, Todo } from '../types';
import { METHODS } from './constants';

const meter = opentelemetry.metrics.getMeter('todo-handler', '1.0.0');
const counters = {
  get: meter.createCounter('todo.getall'),
  getById: meter.createCounter('todo.get'),
  post: meter.createCounter('todo.create'),
  updateById: meter.createCounter('todo.update'),
  deleteById: meter.createCounter('todo.delete'),
};

const get = async (context: Context, _data: DaprInvokerCallbackContent): Promise<{ payload: Todo[] }> => {
  let success = false;
  try {
    const rows = await getAll(context);
    success = true;
    return { payload: rows };
  } catch (error) {
    console.error(error);
    return { payload: [] };
  } finally {
    counters.get.add(1, { success });
  }
};

const post = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  let success = false;
  try {
    //TODO: Use Zod to validate/transform
    const { data: newTodo } = JSON.parse(data.body) as { data: Partial<Todo> };
    const todo = await create(context, newTodo);
    success = true;
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  } finally {
    counters.post.add(1, { success });
  }
};

const getById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  let success = false;
  try {
    //TODO: Use Zod to validate/transform
    const { id } = JSON.parse(data.body) as { id: string };
    const todo = await getTodoById(context, id);
    success = true;
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  } finally {
    counters.getById.add(1, { success });
  }
};

const updateById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  let success = false;
  try {
    //TODO: Use Zod to validate/transform
    const { id, data: updatedTodo } = JSON.parse(data.body) as { id: string; data: Partial<Todo> };
    const todo = await updateTodoById(context, id, updatedTodo);
    success = true;
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  } finally {
    counters.updateById.add(1, { success });
  }
};

const deleteById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  let success = false;
  try {
    //TODO: Use Zod to validate/transform
    const { id } = JSON.parse(data.body) as { id: string };
    const todo = await deleteTodoById(context, id);
    success = true;
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  } finally {
    counters.deleteById.add(1, { success });
  }
};

export const routes: ServiceRoutes = {
  get: {
    methodName: METHODS.TodoGetAll,
    fn: get,
    opts: { method: HttpMethod.GET },
  },
  post: {
    methodName: METHODS.TodoCreate,
    fn: post,
    opts: { method: HttpMethod.POST },
  },
  getById: {
    methodName: METHODS.TodoGetById,
    fn: getById,
    opts: { method: HttpMethod.POST },
  },
  updateById: {
    methodName: METHODS.TodoUpdateById,
    fn: updateById,
    opts: { method: HttpMethod.POST },
  },
  deleteById: {
    methodName: METHODS.TodoDeleteById,
    fn: deleteById,
    opts: { method: HttpMethod.POST },
  },
};
