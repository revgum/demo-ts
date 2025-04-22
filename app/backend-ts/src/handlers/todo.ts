import { context } from '@/context';
import { endpointsFactory } from '@/lib/shared/api/handler';
import { buildItemsResponse, buildResponse } from '@/lib/shared/api/payload';
import { ApiPayloadSchema, UuidParamsSchema } from '@/lib/shared/api/schemas';
import { create, deleteById, getAll, getById, updateById } from '@/models/todo';
import { TodoCreateSchema, TodoSchema, TodoUpdateSchema } from '@/schemas/todo';
import type { Context } from '@/types';
import opentelemetry from '@opentelemetry/api';
import createHttpError from 'http-errors';

const meter = opentelemetry.metrics.getMeter('todo-handler', '1.0.0');
const counters = {
  get: meter.createCounter('todo.getall'),
  getById: meter.createCounter('todo.get'),
  post: meter.createCounter('todo.create'),
  updateById: meter.createCounter('todo.update'),
  deleteById: meter.createCounter('todo.delete'),
};

const todoEndpointsFactory = endpointsFactory<Context, typeof TodoSchema>(context, 'todo', TodoSchema);

/**
 * example route: GET /api/v1/todos
 * - Has no route params or request body
 * - Returns a list of todo records or an error according to the ApiPayloadSchema
 */
export const getAllTodo = todoEndpointsFactory.build({
  method: 'get',
  output: ApiPayloadSchema,
  handler: async ({ options: { context } }) => {
    let success = false;
    try {
      const payload = await getAll(context);
      success = true;
      return buildItemsResponse(TodoSchema, context, payload);
    } catch (err) {
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counters.get.add(1, { success });
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
  handler: async ({ input, options: { context } }) => {
    let success = false;
    try {
      const payload = await create(context, input);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counters.post.add(1, { success });
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
  handler: async ({ input, options: { context } }) => {
    let success = false;
    try {
      const payload = await getById(context, input.id);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counters.getById.add(1, { success });
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
  handler: async ({ input, options: { context } }) => {
    let success = false;
    try {
      const { id, ...updatedTodo } = input;
      const payload = await updateById(context, id, updatedTodo);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counters.updateById.add(1, { success });
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
  handler: async ({ input, options: { context } }) => {
    let success = false;
    try {
      const payload = await deleteById(context, input.id);
      success = true;
      return buildResponse(TodoSchema, context, payload);
    } catch (err) {
      throw createHttpError(500, err as Error, { expose: false });
    } finally {
      counters.deleteById.add(1, { success });
    }
  },
});
