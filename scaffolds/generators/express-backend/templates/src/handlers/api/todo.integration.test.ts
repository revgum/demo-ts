import type { Context } from '@/lib/shared/types';
import { createTodos } from '@/lib/test/models/todo';
import { getAuthHeader } from '@/lib/test/utils';
import { getServer } from '@/lib/test/vitest.integration.setup';
import type { ContextKind, Todo, TodoDb } from '@/types';
import { randomUUID } from 'crypto';
import type { Express } from 'express';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

describe('Integration: Todo API', () => {
  const token = getAuthHeader('test-user').Authorization;
  let todos: Array<{ todoDb: TodoDb; todo: Todo }>;
  let todo: Todo;
  let context: Context<ContextKind>;
  let app: Express;

  beforeAll(async () => {
    const serverContext = await getServer();
    app = serverContext.server.app;
    context = serverContext.context;
  });

  beforeEach(async () => {
    todos = await createTodos(context, { completed: false }, 2);
    todo = todos[0].todo;
  });

  describe('GET /api/v1/todos', () => {
    it('returns a valid payload', async () => {
      const res = await request(app).get('/api/v1/todos').set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        data: {
          currentItemCount: 2,
          items: expect.arrayContaining([
            expect.objectContaining({
              id: todo.id,
            }),
          ]),
          itemsPerPage: 50,
          orderBy: 'created_at',
          orderDirection: 'desc',
          pageIndex: 1,
          totalItems: 2,
          totalPages: 1,
        },
      });
      expect(res.status).toBe(200);
    });
    it('returns a paginated payload', async () => {
      const res = await request(app)
        .get('/api/v1/todos?pageSize=1&orderBy=title&orderDirection=asc')
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        data: {
          currentItemCount: 1,
          items: expect.arrayContaining([
            expect.objectContaining({
              id: todo.id,
            }),
          ]),
          itemsPerPage: 1,
          orderBy: 'title',
          orderDirection: 'asc',
          pageIndex: 1,
          totalItems: 2,
          totalPages: 2,
        },
      });
      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/v1/todos', () => {
    it('returns a valid payload', async () => {
      const res = await request(app)
        .post('/api/v1/todos')
        .send({ title: 'Create a new todo' })
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        data: {
          id: expect.any(String),
          title: 'Create a new todo',
          completed: false,
          createdAt: expect.any(String),
          kind: 'todo',
        },
      });
      expect(res.status).toBe(200);
    });
    it('returns a validation error', async () => {
      const res = await request(app)
        .post('/api/v1/todos')
        .send({ not_title: 'Create a new todo' })
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        error: {
          code: 400,
          message: "title: Required; Unrecognized key(s) in object: 'not_title'",
        },
      });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/v1/todos/{id}', () => {
    it('returns a valid payload', async () => {
      const res = await request(app)
        .put(`/api/v1/todos/${todo.id}`)
        .send({ title: 'Updated todo' })
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        data: {
          id: todo.id,
          title: 'Updated todo',
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          kind: 'todo',
        },
      });
      expect(res.status).toBe(200);
    });
    it('returns a not found error', async () => {
      const invalidId = randomUUID();
      const res = await request(app)
        .put(`/api/v1/todos/${invalidId}`)
        .send({ title: 'Updated todo' })
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        error: {
          code: 404,
          message: `Todo ${invalidId} not found.`,
        },
      });
      expect(res.status).toBe(404);
    });
    it('returns a validation error', async () => {
      const res = await request(app)
        .put(`/api/v1/todos/${todo.id}`)
        .send({ not_title: 'Updated todo' })
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        error: {
          code: 400,
          message: "title: Required; Unrecognized key(s) in object: 'not_title'",
        },
      });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/v1/todos/{id}', () => {
    it('returns a valid payload', async () => {
      const res = await request(app).delete(`/api/v1/todos/${todo.id}`).set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        data: {
          id: todo.id,
          title: 'Test Todo',
          completed: false,
          createdAt: expect.any(String),
          deletedAt: expect.any(String),
          kind: 'todo',
        },
      });
      expect(res.status).toBe(200);
    });
    it('returns a not found error', async () => {
      const invalidId = randomUUID();
      const res = await request(app)
        .delete(`/api/v1/todos/${invalidId}`)
        .set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        error: {
          code: 404,
          message: `Todo ${invalidId} not found.`,
        },
      });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/v1/todos/{id}', () => {
    it('returns a valid payload', async () => {
      const res = await request(app).get(`/api/v1/todos/${todo.id}`).set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        data: {
          id: todo.id,
          title: 'Test Todo',
          completed: false,
          createdAt: expect.any(String),
          kind: 'todo',
        },
      });
      expect(res.status).toBe(200);
    });
    it('returns a not found error', async () => {
      const invalidId = randomUUID();
      const res = await request(app).get(`/api/v1/todos/${invalidId}`).set('Authorization', token);
      expect(res.body).toEqual({
        apiVersion: '1.0',
        id: expect.any(String),
        error: {
          code: 404,
          message: `Todo ${invalidId} not found.`,
        },
      });
      expect(res.status).toBe(404);
    });
  });
});
