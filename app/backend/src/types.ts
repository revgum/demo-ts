import type { Knex } from 'knex';

export type Context = {
  env: 'development' | 'staging' | 'production';
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  db: Knex<any, unknown[]>;
};

export type Test = {
  id: number;
  field1: string;
  created_at: string | Date;
  updated_at?: string | Date;
};
