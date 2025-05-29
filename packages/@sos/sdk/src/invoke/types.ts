import type { HttpMethod, InvokerOptions } from '@dapr/dapr';
import type { Context } from '../types';

export type InvokeArgs<K, A extends string> = {
  context: Context<K>;
  appId: A;
  methodName: string;
  method: HttpMethod;
  data?: object;
  options?: InvokerOptions;
};
