import type { Context } from '@/lib/shared/types';
import { create } from '@/models/todo';
import type { ContextKind } from '@/types';

export const loadSeedData = async (context: Context<ContextKind>) => {
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
