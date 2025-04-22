import type { DaprClient } from '@dapr/dapr';

export type Session = {
  userId: string;
  token: string;
};

export type User = {
  id: string;
};

export type Context = {
  env: 'development' | 'test' | 'production';
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
