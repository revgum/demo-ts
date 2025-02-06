import { HttpMethod } from '@dapr/dapr';
import { context } from '../context';
import type { Test } from '../types';
import { METHODS } from './constants';

const SERVICE_APP_ID = 'backend';

export const getById = async (id: Test['id']) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TestGetById, HttpMethod.POST, { id });

export const getAll = async () => context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TestGetAll, HttpMethod.GET);

export const create = async (data: Partial<Test>) =>
  context.dapr.invoker.invoke(SERVICE_APP_ID, METHODS.TestCreate, HttpMethod.POST, data);
