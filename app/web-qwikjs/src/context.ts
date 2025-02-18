import { env } from './config';
import { daprClient } from './services/dapr';
import type { Context } from './types';

export const context: Context = {
  env,
  dapr: daprClient,
};
