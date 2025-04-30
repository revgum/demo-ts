import { buildKnexConfig } from '@/db/knexfile';
import type { ServiceSecrets } from '@/lib/shared/types';
import Knex from 'knex';

export const knex = (serviceSecrets: ServiceSecrets) => Knex(buildKnexConfig(serviceSecrets));
