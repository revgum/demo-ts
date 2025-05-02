import type { SecretStoreName } from '@/lib/shared/secrets/types';

export type DbConfig = {
  db: {
    host: string;
    port: number;
    database: string;
    ssl: boolean | { rejectUnauthorized: boolean };
    debug: boolean;
  };
  secretsStore: {
    key: string;
    storeName: SecretStoreName;
  };
};
