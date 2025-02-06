import type { DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import type { Knex } from 'knex';
import type { METHODS } from './handlers/constants';

export type Context = {
  env: 'development' | 'staging' | 'production';
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  db: Knex<any, unknown[]>;
};

export type ServiceMethod = (typeof METHODS)[keyof typeof METHODS];

export interface ServiceRoutes extends Record<string, unknown> {
  [key: string]: {
    methodName: ServiceMethod;
    fn: (context: Context, data: DaprInvokerCallbackContent) => Promise<unknown>;
    opts: { method: HttpMethod };
  };
}

export type Test = {
  id: number;
  field1: string;
  created_at: string | Date;
  updated_at?: string | Date;
};
