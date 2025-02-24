import { HttpMethod } from '@dapr/dapr';
import { context } from '../context';
import todo from '../mocks/todo';
import type { Todo } from '../types';
import { APIS } from './constants';

const SERVICE_APP_ID = 'backend-dotnet';
let mockTodos = todo({}, 4);

export const getById = async (id: Todo['id']) => {
  if (context.localDev) {
    return mockTodos.filter((t) => t.id === id)[0];
  }
  return context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoGetById(id), HttpMethod.GET);
};

export const getAll = async () => {
  if (context.localDev) {
    return mockTodos;
  }
  return context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoGetAll(), HttpMethod.GET);
};

export const create = async (data: Partial<Todo>) => {
  if (context.localDev) {
    const newTodo = todo({ ...data }, 1)[0];
    mockTodos.push(newTodo);
    return newTodo;
  }
  return context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoCreate(), HttpMethod.POST, data);
};

export const deleteById = async (id: Todo['id']) => {
  if (context.localDev) {
    mockTodos = mockTodos.filter((t) => t.id !== id);
    return todo({ id }, 1)[0];
  }
  return context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoDelete(id), HttpMethod.DELETE);
};

export const updateById = async (id: Todo['id'], data: Partial<Todo>) => {
  if (context.localDev) {
    const todoIndex = mockTodos.findIndex((t) => t.id === id);
    const foundTodo = mockTodos.find((t) => t.id === id);
    mockTodos[todoIndex] = { ...foundTodo, ...data, id } as Todo;
    return mockTodos[todoIndex];
  }
  return context.dapr.invoker.invoke(SERVICE_APP_ID, APIS.TodoUpdate(id), HttpMethod.PUT, data);
};
