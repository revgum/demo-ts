import type { z } from '@builder.io/qwik-city';
import type { DaprClient } from '@dapr/dapr';
import type { LoginSchema } from './components/login/schemas';
import type { TodoSchema } from './components/todo/schemas';

export type User = {
  id: string;
};

export type Context = {
  env: 'development' | 'staging' | 'production';
  dapr: DaprClient;
  user?: User;
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
export type LoginForm = z.infer<typeof LoginSchema>;
