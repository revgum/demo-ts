import {
  ApiPayloadSchema,
  buildItemsResponse,
  buildResponse,
  createQueryParamsSchema,
  endpointsFactory,
  UuidParamsSchema,
  type QueryParams,
} from '@/lib/shared/api';
import { buildHandlerContext } from '@/lib/shared/context';
import type { Context } from '@/lib/shared/types';
import { TodoCreateSchema, TodoQueryFields, TodoSchema, TodoUpdateSchema } from '@/schemas/todo';
import * as TodoService from '@/services/todo';
import { getUser } from '@/services/user';
import { ContextKinds, type ContextKind, type TodoQueryField } from '@/types';
import createHttpError from 'http-errors';

const todoEndpointsFactory = (context: Context<ContextKind>, handlerEndpoint: string) => {
  const handlerContext = buildHandlerContext(
    {
      apiKind: ContextKinds.TODO,
      handlerName: 'todo-api',
      handlerEndpoint,
    },
    context,
  );
  return endpointsFactory<Context<ContextKind>, typeof TodoSchema>(
    handlerContext,
    TodoSchema,
    getUser,
  );
};

/**
 * example route: GET /api/v1/todos?page=2&pageSize=25
 * - Has no route params or request body
 * - Returns a list of todo records or an error according to the ApiPayloadSchema
 */
export const getAllTodo = (context: Context<ContextKind>) =>
  todoEndpointsFactory(context, 'todo.get-all-todo').build({
    method: 'get',
    input: createQueryParamsSchema(TodoQueryFields),
    output: ApiPayloadSchema,
    handler: async ({ options: { context }, logger, input }) => {
      try {
        const payload = await TodoService.getAllTodo({
          serviceParams: { context, logger },
          queryParams: input as QueryParams<TodoQueryField>,
        });
        return buildItemsResponse(TodoSchema, context, payload);
      } catch (err) {
        logger.error({ err }, 'Error fetching todos');
        throw createHttpError(500, err as Error, { expose: false });
      }
    },
  });

/**
 * example route: POST /api/v1/todos
 * - Has no route params
 * - Has a request body with the todo object according to the CreateTodoSchema
 * - Returns a new todo record or an error according to the ApiPayloadSchema
 */
export const createTodo = (context: Context<ContextKind>) =>
  todoEndpointsFactory(context, 'todo.create-todo').build({
    method: 'post',
    input: TodoCreateSchema,
    output: ApiPayloadSchema,
    handler: async ({ input, options: { context }, logger }) => {
      try {
        const payload = await TodoService.createTodo({ context, logger, input });
        return buildResponse(TodoSchema, context, payload);
      } catch (err) {
        logger.error({ err }, 'Error creating todo');
        throw createHttpError(500, err as Error, { expose: false });
      }
    },
  });

/**
 * example route: GET /api/v1/todos/:id
 * - Has a route param for the todo id
 * - Has no request body
 * - Returns a todo record or an error according to the ApiPayloadSchema
 */
export const getTodoById = (context: Context<ContextKind>) =>
  todoEndpointsFactory(context, 'todo.get-todo-by-id').build({
    method: 'get',
    input: UuidParamsSchema,
    output: ApiPayloadSchema,
    handler: async ({ input, options: { context }, logger }) => {
      try {
        const payload = await TodoService.getTodoById({ context, logger, input: input.id });
        return buildResponse(TodoSchema, context, payload);
      } catch (err) {
        logger.error({ err, id: input.id }, 'Error fetching todo');
        throw createHttpError(500, err as Error, { expose: false });
      }
    },
  });

/**
 * example route: PUT /api/v1/todos/:id
 * - Has a route param for the todo id
 * - Has a request body with the todo object according to the UpdateTodoSchema
 * - Returns an updated todo record or an error according to the ApiPayloadSchema
 */
export const updateTodoById = (context: Context<ContextKind>) =>
  todoEndpointsFactory(context, 'todo.update-todo-by-id').build({
    method: ['put', 'patch'],
    input: UuidParamsSchema.merge(TodoUpdateSchema),
    output: ApiPayloadSchema,
    handler: async ({ input, options: { context }, logger }) => {
      try {
        const payload = await TodoService.updateTodoById({ context, logger, input });
        return buildResponse(TodoSchema, context, payload);
      } catch (err) {
        logger.error({ err, id: input.id }, 'Error updating todo');
        throw createHttpError(500, err as Error, { expose: false });
      }
    },
  });

/**
 * example route: DELETE /api/v1/todos/:id
 * - Has a route param for the todo id
 * - Has no request body
 * - Returns a deleted todo record or an error according to the ApiPayloadSchema
 */
export const deleteTodoById = (context: Context<ContextKind>) =>
  todoEndpointsFactory(context, 'todo.delete-todo-by-id').build({
    method: 'delete',
    input: UuidParamsSchema,
    output: ApiPayloadSchema,
    handler: async ({ input, options: { context }, logger }) => {
      try {
        const payload = await TodoService.deleteTodoById({ context, logger, input: input.id });
        return buildResponse(TodoSchema, context, payload);
      } catch (err) {
        logger.error({ err, id: input.id }, 'Error deleting todo');
        throw createHttpError(500, err as Error, { expose: false });
      }
    },
  });
