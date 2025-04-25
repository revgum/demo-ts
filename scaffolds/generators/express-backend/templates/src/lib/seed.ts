import { create } from '@/models/todo';
import type { Context } from '@/types';

export const loadSeedData = async (context: Context) => {
  const record = await create(context, {
    title: `Task ${new Date().toISOString()}`,
    completed: false,
  });
  console.log(`Created new Todo model: ${JSON.stringify(record)}`);
};
