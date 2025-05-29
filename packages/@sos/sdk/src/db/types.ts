import type { SecretStoreName } from '../secrets/types';

export type DbConfig = {
  db: {
    host: string;
    port: number;
    database: string;
    schema: string;
    ssl: boolean | { rejectUnauthorized: boolean };
    debug: boolean;
  };
  secretsStore: {
    key: string;
    storeName: SecretStoreName;
  };
};
