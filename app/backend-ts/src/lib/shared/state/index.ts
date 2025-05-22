import { buildDaprClient } from '@/lib/shared/dapr';
import type { StateDeleteArgs, StateName, StateSaveArgs } from './types';

export const StateNames = { REDIS: 'redis-state' } as const;

export const cacheKey = (stateName: StateName, id: string) => `${stateName}:${id}`;

export const save = async <K>({ context, stateName, stateObjects, options }: StateSaveArgs<K>) => {
  const daprClient = buildDaprClient(context);
  const stateObjectsWithKey = stateObjects.map((stateObject) => ({
    ...stateObject,
    key: cacheKey(stateName, stateObject.key),
  }));
  return daprClient.state.save(stateName, stateObjectsWithKey, options);
};

export const destroy = async <K>({ context, stateName, id, options }: StateDeleteArgs<K>) => {
  const daprClient = buildDaprClient(context);
  const key = cacheKey(stateName, id);
  return daprClient.state.delete(stateName, key, options);
};
