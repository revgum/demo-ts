import config from '@/db/knexfile';
import type { Context } from '@/lib/shared/types';
import type { ContextKind } from '@/types';
import Knex from 'knex';

export const knex = (env: Context<ContextKind>['env']) => Knex(config[env]);
