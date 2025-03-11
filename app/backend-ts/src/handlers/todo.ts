import opentelemetry from '@opentelemetry/api';
import type { Request, Response } from 'express';
import { create, deleteById, getAll, getById, updateById } from '../models/todo';
import { CreateTodoSchema, TodoListResponseSchema, TodoResponseSchema, UpdateTodoSchema } from '../schemas/todo';
import type { Context } from '../types';

const meter = opentelemetry.metrics.getMeter('todo-handler', '1.0.0');
const counters = {
  get: meter.createCounter('todo.getall'),
  getById: meter.createCounter('todo.get'),
  post: meter.createCounter('todo.create'),
  updateById: meter.createCounter('todo.update'),
  deleteById: meter.createCounter('todo.delete'),
};

export const getAllTodo = (context: Context) => async (_req: Request, res: Response) => {
  let success = false;
  try {
    const payload = await getAll(context);
    success = true;
    res.json(TodoListResponseSchema.parse({ payload }));
  } catch (err) {
    console.error(err);
    const error = err.message || 'Unhandled error';
    res.json(TodoListResponseSchema.parse({ error }));
  } finally {
    counters.get.add(1, { success });
  }
};

export const createTodo = (context: Context) => async (req: Request, res: Response) => {
  let success = false;
  try {
    const newTodo = CreateTodoSchema.parse(req.body ?? {});
    const payload = await create(context, newTodo);
    success = true;
    res.json(TodoResponseSchema.parse({ payload }));
  } catch (err) {
    console.error(err);
    const error = err.message || 'Unhandled error';
    res.json(TodoResponseSchema.parse({ error }));
  } finally {
    counters.post.add(1, { success });
  }
};

export const getTodoById = (context: Context) => async (req: Request, res: Response) => {
  let success = false;
  try {
    const id = req.params.id;
    const payload = await getById(context, id);
    success = true;
    res.json(TodoResponseSchema.parse({ payload }));
  } catch (err) {
    console.error(err);
    const error = err.message || 'Unhandled error';
    res.json(TodoResponseSchema.parse({ error }));
  } finally {
    counters.getById.add(1, { success });
  }
};

export const updateTodoById = (context: Context) => async (req: Request, res: Response) => {
  let success = false;
  try {
    const id = req.params.id;
    const updatedTodo = UpdateTodoSchema.parse(req.body ?? {});
    const payload = await updateById(context, id, updatedTodo);
    success = true;
    res.json(TodoResponseSchema.parse({ payload }));
  } catch (err) {
    console.error(err);
    const error = err.message || 'Unhandled error';
    res.json(TodoResponseSchema.parse({ error }));
  } finally {
    counters.updateById.add(1, { success });
  }
};

export const deleteTodoById = (context: Context) => async (req: Request, res: Response) => {
  let success = false;
  try {
    const id = req.params.id;
    const payload = await deleteById(context, id);
    success = true;
    res.json(TodoResponseSchema.parse({ payload }));
  } catch (err) {
    console.error(err);
    const error = err.message || 'Unhandled error';
    res.json(TodoResponseSchema.parse({ error }));
  } finally {
    counters.deleteById.add(1, { success });
  }
};
