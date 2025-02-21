import type { DaprInvokerCallbackContent, HttpMethod } from '@dapr/dapr';
import type { Knex } from 'knex';
import type { z } from 'zod';
import type { METHODS } from './handlers/constants';
import type {
  CreateTodoSchema,
  TodoListResponseSchema,
  TodoResponseSchema,
  TodoSchema,
  UpdateTodoSchema,
} from './schemas/todo';

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

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoModel = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoModel = z.infer<typeof UpdateTodoSchema>;
export type TodoResponse = z.infer<typeof TodoResponseSchema>;
export type TodoListResponse = z.infer<typeof TodoListResponseSchema>;
