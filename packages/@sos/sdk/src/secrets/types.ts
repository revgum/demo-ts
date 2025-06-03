import type { SecretStoreNames } from '../secrets';
import type { Context } from '../types';

export type SecretStoreName = (typeof SecretStoreNames)[keyof typeof SecretStoreNames];

export type SecretsArgs<K> = {
  context: Context<K>;
  secretStoreName: SecretStoreName;
  secretKey: string;
};
