import type { KeyValuePairType } from '@dapr/dapr/types/KeyValuePair.type';
import type { StateDeleteOptions } from '@dapr/dapr/types/state/StateDeleteOptions.type';
import type { StateGetOptions } from '@dapr/dapr/types/state/StateGetOptions.type';
import type { StateSaveOptions } from '@dapr/dapr/types/state/StateSaveOptions.type';
import type { StateNames } from '.';
import type { Context } from '../types';

export type StateName = (typeof StateNames)[keyof typeof StateNames];

export type StateArgs<K> = {
  context: Context<K>;
  stateName: StateName;
};

export type StateSaveArgs<K> = StateArgs<K> & {
  stateObjects: KeyValuePairType[];
  options?: StateSaveOptions;
};

export type StateGetArgs<K> = StateArgs<K> & {
  key: string;
  options?: StateGetOptions;
};

export type StateDeleteArgs<K> = StateArgs<K> & {
  key: string;
  options?: StateDeleteOptions;
};
