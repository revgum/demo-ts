import { Router } from 'express';
import { createTodo, deleteTodoById, getAllTodo, getTodoById, updateTodoById } from '../../handlers/todo';
import type { Context } from '../../types';

export const todoRouter = (context: Context) => {
  const router = Router({ mergeParams: true });

  router.get('/', getAllTodo(context));
  router.post('/', createTodo(context));
  router.get('/:id', getTodoById(context));
  router.put('/:id', updateTodoById(context));
  router.delete('/:id', deleteTodoById(context));

  return router;
};
