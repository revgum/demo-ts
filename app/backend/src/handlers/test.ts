import { type DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import { create, getAll, getById as getTestById } from '../models/test';
import type { Context, ServiceRoutes, Test } from '../types';
import { METHODS } from './constants';

const get = async (context: Context, _data: DaprInvokerCallbackContent): Promise<{ payload: Test[] }> => {
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
): Promise<{ payload?: Test; error?: string }> => {
  try {
    //TODO: Use Zod to validate/transform
    const newTest = JSON.parse(data.body) as Partial<Test>;
    const test = await create(context, newTest);
    return { payload: test };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  }
};

const getById = async (
  context: Context,
  data: DaprInvokerCallbackContent,
): Promise<{ payload?: Test; error?: string }> => {
  try {
    //TODO: Use Zod to validate/transform
    const { id } = JSON.parse(data.body) as Partial<Test>;
    const test = await getTestById(context, id);
    return { payload: test };
  } catch (error) {
    console.error(error);
    return { error: error.detail || 'Unhandled error' };
  }
};

export const routes: ServiceRoutes = {
  get: {
    methodName: METHODS.TestGetAll,
    fn: get,
    opts: { method: HttpMethod.GET },
  },
  post: {
    methodName: METHODS.TestCreate,
    fn: post,
    opts: { method: HttpMethod.POST },
  },
  getById: {
    methodName: METHODS.TestGetById,
    fn: getById,
    opts: { method: HttpMethod.POST },
  },
};
