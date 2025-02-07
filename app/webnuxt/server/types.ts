import type { DaprClient } from '@dapr/dapr';

export type Context = {
  env: 'development' | 'staging' | 'production';
  dapr: DaprClient;
};

export type Test = {
  id: number;
  field1: string;
  created_at: string;
  updated_at?: string;
};
