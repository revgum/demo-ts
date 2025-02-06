import Knex from 'knex';
import type { Context } from '../types';
import config from './knexfile';

export const knex = (env: Context['env']) => Knex(config[env]);
