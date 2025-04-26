import { create } from '@/models/todo';
import type { Context } from '@/types';

export const loadSeedData = async (context: Context) => {
  const trx = await context.db.transaction();
  try {
    const record = await create(context, trx, {
      title: `Task ${new Date().toISOString()}`,
      completed: false,
    });
    await trx.commit();
    console.log(`Created new Todo model: ${JSON.stringify(record)}`);
  } catch (error) {
    await trx.rollback();
    console.error('Error creating seed data:', error);
  }
};
