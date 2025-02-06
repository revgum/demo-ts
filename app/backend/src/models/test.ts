import { randomUUID } from 'node:crypto';
import type { Context, Test } from '../types';

export const TABLE_NAME = 'test';

export const getAll = async (context: Context): Promise<Test[]> => context.db<Test>(TABLE_NAME);

export const create = async (context: Context, obj: Partial<Test>): Promise<Test> => {
  const rows = await context
    .db<Test>(TABLE_NAME)
    .insert({
      field1: obj.field1 || randomUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning<Test[]>('*');

  if (!rows.length) {
    throw new Error('New test record not returned.');
  }

  return rows[0];
};
