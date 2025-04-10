import config from '@/db/knexfile';
import type { Context } from '@/types';
import Knex from 'knex';

export const knex = (env: Context['env']) => Knex(config[env]);
