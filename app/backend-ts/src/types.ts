import type { Knex } from 'knex';
import type { z } from 'zod';
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

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoModel = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoModel = z.infer<typeof UpdateTodoSchema>;
export type TodoResponse = z.infer<typeof TodoResponseSchema>;
export type TodoListResponse = z.infer<typeof TodoListResponseSchema>;
