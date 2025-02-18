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

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string | Date;
  due_at?: string | Date | null;
  deleted_at?: string | Date | null;
  updated_at?: string | Date | null;
};
