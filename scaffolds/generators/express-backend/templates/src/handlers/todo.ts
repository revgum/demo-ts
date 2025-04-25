import { context } from '@/lib/context';
import { createCounter, createTimer } from '@/lib/metrics';
import {
  ApiPayloadSchema,
  buildItemsResponse,
  buildResponse,
  endpointsFactory,
  UuidParamsSchema,
} from '@/lib/shared/api';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import { TodoCreateSchema, TodoSchema, TodoUpdateSchema } from '@/schemas/todo';
import type { Context } from '@/types';
import createHttpError from 'http-errors';

const todoEndpointsFactory = endpointsFactory<Context, typeof TodoSchema>(
  context,
  'todo',
  TodoSchema,
);

/**
 * example route: GET /api/v1/todos
 * - Has no route params or request body
 * - Returns a list of todo records or an error according to the ApiPayloadSchema
 */
export const getAllTodo = todoEndpointsFactory.build({
  method: 'get',
  output: ApiPayloadSchema,
  handler: async ({ options: { context }, logger }) => {
    let success = false;
    const counter = createCounter(context, 'todo', 'todo.get-all-todo');
    const timer = createTimer(context, 'todo', 'todo.get-all-todo-ms');
    const start = performance.now();
    try {
      const payload = await getAll(context);
      success = true;
      return buildItemsResponse(TodoSchema, context, payload);
    } catch (err) {
      logger.error({ err }, 'Error fetching todos');
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counter.add(1, { success });
      timer.record(performance.now() - start, { success });
    }
  },
});

/**
 * example route: POST /api/v1/todos
 * - Has no route params
 * - Has a request body with the todo object according to the CreateTodoSchema
 * - Returns a new todo record or an error according to the ApiPayloadSchema
 */
export const createTodo = todoEndpointsFactory.build({
  method: 'post',
  input: TodoCreateSchema,
  output: ApiPayloadSchema,
  handler: async ({ input, options: { context }, logger }) => {
    let success = false;
    const counter = createCounter(context, 'todo', 'todo.create-todo');
    const timer = createTimer(context, 'todo', 'todo.create-todo-ms');
    const start = performance.now();
    try {
      const payload = await create(context, input);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      logger.error({ err }, 'Error creating todo');
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counter.add(1, { success });
      timer.record(performance.now() - start, { success });
    }
  },
});

/**
 * example route: GET /api/v1/todos/:id
 * - Has a route param for the todo id
 * - Has no request body
 * - Returns a todo record or an error according to the ApiPayloadSchema
 */
export const getTodoById = todoEndpointsFactory.build({
  method: 'get',
  input: UuidParamsSchema,
  output: ApiPayloadSchema,
  handler: async ({ input, options: { context }, logger }) => {
    let success = false;
    const counter = createCounter(context, 'todo', 'todo.get-todo-by-id');
    const timer = createTimer(context, 'todo', 'todo.get-todo-by-id-ms');
    const start = performance.now();
    try {
      const payload = await getById(context, input.id);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      logger.error({ err, id: input.id }, 'Error fetching todo');
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counter.add(1, { success });
      timer.record(performance.now() - start, { success });
    }
  },
});

/**
 * example route: PUT /api/v1/todos/:id
 * - Has a route param for the todo id
 * - Has a request body with the todo object according to the UpdateTodoSchema
 * - Returns an updated todo record or an error according to the ApiPayloadSchema
 */
export const updateTodoById = todoEndpointsFactory.build({
  method: ['put', 'patch'],
  input: UuidParamsSchema.merge(TodoUpdateSchema),
  output: ApiPayloadSchema,
  handler: async ({ input, options: { context }, logger }) => {
    let success = false;
    const counter = createCounter(context, 'todo', 'todo.update-todo-by-id');
    const timer = createTimer(context, 'todo', 'todo.update-todo-by-id-ms');
    const start = performance.now();
    try {
      const { id, ...updatedTodo } = input;
      const payload = await updateById(context, id, updatedTodo);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      logger.error({ err, id: input.id }, 'Error updating todo');
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counter.add(1, { success });
      timer.record(performance.now() - start, { success });
    }
  },
});

/**
 * example route: DELETE /api/v1/todos/:id
 * - Has a route param for the todo id
 * - Has no request body
 * - Returns a deleted todo record or an error according to the ApiPayloadSchema
 */
export const deleteTodoById = todoEndpointsFactory.build({
  method: 'delete',
  input: UuidParamsSchema,
  output: ApiPayloadSchema,
  handler: async ({ input, options: { context }, logger }) => {
    let success = false;
    const counter = createCounter(context, 'todo', 'todo.delete-todo-by-id');
    const timer = createTimer(context, 'todo', 'todo.delete-todo-by-id-ms');
    const start = performance.now();
    try {
      const payload = await deleteById(context, input.id);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      logger.error({ err, id: input.id }, 'Error deleting todo');
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counter.add(1, { success });
      timer.record(performance.now() - start, { success });
    }
  },
});
