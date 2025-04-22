import { context } from '@/context';
import type { Todo } from '@/types';
import { HttpMethod } from '@dapr/dapr';
import { cache } from 'react';

const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const SERVICE_APP_ID = 'backend-ts';

const METHODS = {
  TodoGetAll: () => 'api/v1/todos',
  TodoCreate: () => 'api/v1/todos',
  TodoGetById: (id: string) => `api/v1/todos/${id}`,
  TodoUpdateById: (id: string) => `api/v1/todos/${id}`,
  TodoDeleteById: (id: string) => `api/v1/todos/${id}`,
} as const;

export const getById = cache(
  async (id: Todo['id']) =>
    context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TodoGetById(id), HttpMethod.GET) as Promise<{
      payload: Todo;
    }>,
);

export const getAll = cache(
  async (token: string) =>
    context.dapr.invoker.invoke(
      SERVICE_APP_ID,
      METHODS.TodoGetAll(),
      HttpMethod.GET,
      undefined,
      authHeaders(token),
    ) as Promise<{
      data: { items: Todo[] };
    }>,
);

export const create = async (token: string, data: Partial<Todo>) =>
  context.dapr.invoker.invoke(
    SERVICE_APP_ID,
    METHODS.TodoCreate(),
    HttpMethod.POST,
    { ...data },
    authHeaders(token),
  ) as Promise<{
    data: Todo;
  }>;

export const deleteById = async (token: string, id: Todo['id']) =>
  context.dapr.invoker.invoke(
    SERVICE_APP_ID,
    METHODS.TodoDeleteById(id),
    HttpMethod.DELETE,
    undefined,
    authHeaders(token),
  ) as Promise<{
    data: Todo;
  }>;

export const updateById = async (token: string, id: Todo['id'], data: Partial<Todo>) =>
  context.dapr.invoker.invoke(
    SERVICE_APP_ID,
    METHODS.TodoUpdateById(id),
    HttpMethod.PUT,
    { ...data },
    authHeaders(token),
  ) as Promise<{
    data: Todo;
  }>;
