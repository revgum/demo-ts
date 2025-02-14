import { HttpMethod } from '@dapr/dapr';
import { context } from '../context';
import type { Todo } from '../types';
import { APIS } from './constants';

const SERVICE_APP_ID = 'backend-dotnet';

export const getById = async (id: Todo['id']) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoGetById(id), HttpMethod.GET);

export const getAll = async () => context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoGetAll(), HttpMethod.GET);

export const create = async (data: Partial<Todo>) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoCreate(), HttpMethod.POST, data);

export const deleteById = async (id: Todo['id']) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoDelete(id), HttpMethod.DELETE);

export const updateById = async (id: Todo['id'], data: Partial<Todo>) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoUpdate(id), HttpMethod.PUT, data);
