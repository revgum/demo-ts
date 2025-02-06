import { type DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import { create, getAll } from '../models/test';
import type { Context, Test } from '../types';

const get = async (context: Context, data: DaprInvokerCallbackContent): Promise<Test[]> => {
  console.log('Invoked body: ', data.body);
  console.log('Invoked metadata: ', data.metadata);
  console.log('Invoked query: ', data.query);
  console.log('Invoked headers: ', data.headers); // only available in HTTP
  const rows = await getAll(context);
  return rows;
};

const post = async (context: Context, data: DaprInvokerCallbackContent): Promise<Test> => {
  //TODO: Use Zod to validate/transform
  const record = await create(context, data as Partial<Test>);
  return record;
};

export const routes = {
  get: {
    methodName: 'hello',
    fn: get,
    opts: { method: HttpMethod.GET },
  },
  post: {
    methodName: 'hello',
    fn: post,
    opts: { method: HttpMethod.POST },
  },
};
