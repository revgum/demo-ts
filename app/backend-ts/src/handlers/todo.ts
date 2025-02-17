import { type DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import {
  create,
  deleteById as deleteTodoById,
  getAll,
  getById as getTodoById,
  updateById as updateTodoById,
} from '../models/todo';
import type { Context, ServiceRoutes, Todo } from '../types';
import { METHODS } from './constants';

const get = async (context: Context, _data: DaprInvokerCallbackContent): Promise<{ payload: Todo[] }> => {
  try {
    const rows = await getAll(context);
    return { payload: rows };
  } catch (error) {
    console.error(error);
    return { payload: [] };
  }
};

const post = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  try {
    //TODO: Use Zod to validate/transform
    const newTodo = JSON.parse(data.body) as Partial<Todo>;
    const todo = await create(context, newTodo);
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  }
};

const getById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  try {
    //TODO: Use Zod to validate/transform
    const { id } = JSON.parse(data.body) as Partial<Todo>;
    const todo = await getTodoById(context, id);
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  }
};

const updateById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  try {
    //TODO: Use Zod to validate/transform
    const updatedTodo = JSON.parse(data.body) as Partial<Todo>;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    const todo = await updateTodoById(context, updatedTodo.id!, updatedTodo);
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  }
};

const deleteById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Todo; error?: string }> => {
  try {
    //TODO: Use Zod to validate/transform
    const { id } = JSON.parse(data.body) as Partial<Todo>;
    const todo = await deleteTodoById(context, id);
    return { payload: todo };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
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
