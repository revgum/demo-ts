import type { z } from '@builder.io/qwik-city';
import type { DaprClient } from '@dapr/dapr';
import type { TodoSchema } from './components/todo/schemas';

export type Context = {
  env: 'development' | 'staging' | 'production';
  dapr: DaprClient;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  due_at?: string | null;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type TodoForm = z.infer<typeof TodoSchema>;
