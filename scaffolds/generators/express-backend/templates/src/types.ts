import type { UuidParamsSchema } from '@/lib/shared/api';
import type {
  TodoApiDataSchema,
  TodoCreateSchema,
  TodoDbSchema,
  TodoSchema,
  TodoUpdateSchema,
} from '@/schemas/todo';
import type { Knex } from 'knex';
import type { Logger } from 'pino';
import type { z } from 'zod';

export const ContextKinds = { UNKNOWN: 'unknown', TODO: 'todo' } as const;
export type ContextKind = (typeof ContextKinds)[keyof typeof ContextKinds];

export type Context = {
  env: 'development' | 'staging' | 'production';
  api: {
    version: string;
    kind: ContextKind;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: Knex<any, unknown[]>;
  transaction?: Knex.Transaction;
  runtime: {
    debug: boolean;
    localhost: boolean;
  };
  server: {
    host: string;
    port: string;
  };
  dapr: {
    host: string;
    port: string;
  };
};

export type ServiceParams<T> = {
  context: Context;
  logger: Logger;
  input?: T;
};

export type Uuid = z.infer<typeof UuidParamsSchema>;
export type TodoDb = z.infer<typeof TodoDbSchema>;
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoModel = z.infer<typeof TodoCreateSchema>;
export type UpdateTodoModel = z.infer<typeof TodoUpdateSchema>;
export type TodoData = z.infer<typeof TodoApiDataSchema>;
