import { Router } from 'express';
import type { Context } from '../../types';
import { todoRouter } from './todo';

export const V1Router = (context: Context) => {
  const router = Router({ mergeParams: true });
  const todosRouter = todoRouter(context);

  router.use('/todos', todosRouter);
  return router;
};
