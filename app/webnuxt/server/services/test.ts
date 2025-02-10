import { HttpMethod } from '@dapr/dapr';
import { context } from '../context';
import type { Test } from '../types';
import { METHODS } from './constants';

const SERVICE_APP_ID = 'backend';

export const getById = async (id: Test['id']) => {
  const [test, test_dotnet] = await Promise.all([
    context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TestGetById, HttpMethod.POST, { id }),
  ]);
  console.log({ test }, { test_dotnet });
  return test;
};

export const getAll = async () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [tests, tests_dotnet]: any[] = await Promise.all([
    context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TestGetAll, HttpMethod.GET),
  ]);
  console.log(`backend returned: ${tests?.payload.length}, backend-node returned: ${tests_dotnet?.payload.length}`);
  return tests;
};

export const create = async (data: Partial<Test>) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TestCreate, HttpMethod.POST, data);
