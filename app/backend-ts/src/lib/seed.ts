import { create } from '@/models/todo';
import type { Context } from '@/types';

export const loadSeedData = async (context: Context) => {
  const { db, logger } = context;
  const trx = await db.transaction();
  try {
    const record = await create(context, trx, {
      title: `Task ${new Date().toISOString()}`,
      completed: false,
    });
    await trx.commit();
    logger.info(`Created new Todo model: ${JSON.stringify(record)}`);
  } catch (error) {
    await trx.rollback();
    logger.error('Error creating seed data:', error);
  }
};
