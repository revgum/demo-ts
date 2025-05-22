import { buildDaprClient } from '@/lib/shared/dapr';
import type { StateDeleteArgs, StateGetArgs, StateSaveArgs } from './types';

export const StateNames = { REDIS: 'redis-state' } as const;

export const get = async <K>({ context, stateName, key, options }: StateGetArgs<K>) => {
  const daprClient = buildDaprClient(context);
  return daprClient.state.get(stateName, key, options);
};

export const save = async <K>({ context, stateName, stateObjects, options }: StateSaveArgs<K>) => {
  const daprClient = buildDaprClient(context);
  return daprClient.state.save(stateName, stateObjects, options);
};

export const destroy = async <K>({ context, stateName, key, options }: StateDeleteArgs<K>) => {
  const daprClient = buildDaprClient(context);
  return daprClient.state.delete(stateName, key, options);
};
