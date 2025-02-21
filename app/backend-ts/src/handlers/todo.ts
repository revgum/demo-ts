import { type DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import opentelemetry from '@opentelemetry/api';
import {
  create,
  deleteById as deleteTodoById,
  getAll,
  getById as getTodoById,
  updateById as updateTodoById,
} from '../models/todo';
import {
  CreateTodoSchema,
  GetTodoSchema,
  TodoListResponseSchema,
  TodoResponseSchema,
  UpdateTodoSchema,
} from '../schemas/todo';
import type { Context, ServiceRoutes, Todo, TodoListResponse, TodoResponse } from '../types';
import { METHODS } from './constants';

const meter = opentelemetry.metrics.getMeter('todo-handler', '1.0.0');
const counters = {
  get: meter.createCounter('todo.getall'),
  getById: meter.createCounter('todo.get'),
  post: meter.createCounter('todo.create'),
  updateById: meter.createCounter('todo.update'),
  deleteById: meter.createCounter('todo.delete'),
};

const get = async (context: Context, _data: DaprInvokerCallbackContent): Promise<TodoListResponse> => {
  let success = false;
  try {
    const payload = await getAll(context);
    success = true;
    return TodoListResponseSchema.parse({ payload });
  } catch (err) {
    console.error(err);
    const error = err.detail || 'Unhandled error';
    return TodoListResponseSchema.parse({ error });
  } finally {
    counters.get.add(1, { success });
  }
};

const post = async (context: Context, data: DaprInvokerCallbackContent): Promise<TodoResponse> => {
  let success = false;
  try {
    const { data: newTodo } = CreateTodoSchema.parse(JSON.parse(data.body ?? '{}'));
    const payload = await create(context, newTodo);
    success = true;
    return TodoResponseSchema.parse({ payload });
  } catch (err) {
    console.error(err);
    const error = err.detail || 'Unhandled error';
    return TodoResponseSchema.parse({ error });
  } finally {
    counters.post.add(1, { success });
  }
};

const getById = async (context: Context, data: DaprInvokerCallbackContent): Promise<TodoResponse> => {
  let success = false;
  try {
    const { id } = GetTodoSchema.parse(JSON.parse(data.body ?? '{}'));
    const payload = await getTodoById(context, id);
    success = true;
    return TodoResponseSchema.parse({ payload });
  } catch (err) {
    console.error(err);
    const error = err.detail || 'Unhandled error';
    return TodoResponseSchema.parse({ error });
  } finally {
    counters.getById.add(1, { success });
  }
};

const updateById = async (context: Context, data: DaprInvokerCallbackContent): Promise<TodoResponse> => {
  let success = false;
  try {
    const { id, data: updatedTodo } = UpdateTodoSchema.parse(JSON.parse(data.body ?? '{}'));
    const payload = await updateTodoById(context, id, updatedTodo);
    success = true;
    return TodoResponseSchema.parse({ payload });
  } catch (err) {
    console.error(err);
    const error = err.detail || 'Unhandled error';
    return TodoResponseSchema.parse({ error });
  } finally {
    counters.updateById.add(1, { success });
  }
};

const deleteById = async (context: Context, data: DaprInvokerCallbackContent): Promise<TodoResponse> => {
  let success = false;
  try {
    const { id } = GetTodoSchema.parse(JSON.parse(data.body ?? '{}'));
    const payload = await deleteTodoById(context, id);
    success = true;
    return TodoResponseSchema.parse({ payload });
  } catch (err) {
    console.error(err);
    const error = err.detail || 'Unhandled error';
    return TodoResponseSchema.parse({ error });
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
