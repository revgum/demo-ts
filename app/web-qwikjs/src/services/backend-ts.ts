import { HttpMethod } from '@dapr/dapr';
import { context } from '../context';
import type { Todo } from '../types';
import { METHODS } from './constants';

const SERVICE_APP_ID = 'backend-ts';

export const getById = async (id: Todo['id']) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TodoGetById(id), HttpMethod.GET) as Promise<{
    payload: Todo;
  }>;

export const getAll = async () =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TodoGetAll(), HttpMethod.GET) as Promise<{ payload: Todo[] }>;

export const create = async (data: Partial<Todo>) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TodoCreate(), HttpMethod.POST, { ...data }) as Promise<{
    payload: Todo;
  }>;

export const deleteById = async (id: Todo['id']) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TodoDeleteById(id), HttpMethod.DELETE) as Promise<{
    payload: Todo;
  }>;

export const updateById = async (id: Todo['id'], data: Partial<Todo>) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TodoUpdateById(id), HttpMethod.PUT, { ...data }) as Promise<{
    payload: Todo;
  }>;
