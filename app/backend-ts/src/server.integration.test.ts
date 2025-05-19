import { buildServer } from '@/server';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

describe('Express API integration tests', () => {
  const testingApiRoute = '/api/v1/todos';
  const invalidSignatureJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMWIyYzMiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.vnDx2GJ9Ys1c_VmrizSU4HkxnnlOY9UcSTL8Dg4wwuI';
  const invalidUserJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.8nYFUX869Y1mnDDDU4yL11aANgVRuifoxrE8BHZY1iE';

  it('returns 401 when no authorization headers are present ', async () => {
    const { server } = await buildServer();
    const res = await request(server.app).get(testingApiRoute);
    expect(res.body).toEqual({
      apiVersion: '1.0',
      id: expect.any(String),
      error: {
        code: 401,
        message: 'Missing token',
      },
    });
    expect(res.status).toBe(401);
  });
  it('returns 500 when the jwt is malformed', async () => {
    const { server } = await buildServer();
    const res = await request(server.app)
      .get(testingApiRoute)
      .set('Authorization', 'Bearer invalid-token');
    expect(res.body).toEqual({
      apiVersion: '1.0',
      id: expect.any(String),
      error: {
        code: 500,
        message: 'jwt malformed',
      },
    });
    expect(res.status).toBe(500);
  });
  it('returns 500 when the jwt is invalid', async () => {
    const { server } = await buildServer();
    const res = await request(server.app)
      .get(testingApiRoute)
      .set('Authorization', `Bearer ${invalidSignatureJwt}`);
    expect(res.body).toEqual({
      apiVersion: '1.0',
      id: expect.any(String),
      error: {
        code: 500,
        message: 'invalid signature',
      },
    });
    expect(res.status).toBe(500);
  });
  it('returns 401 when the jwt does not contain a user', async () => {
    const { server } = await buildServer();
    const res = await request(server.app)
      .get(testingApiRoute)
      .set('Authorization', `Bearer ${invalidUserJwt}`);
    expect(res.body).toEqual({
      apiVersion: '1.0',
      id: expect.any(String),
      error: {
        code: 401,
        message: 'Invalid token',
      },
    });
    expect(res.status).toBe(401);
  });
  it('returns 404 for an invalid route', async () => {
    const { server } = await buildServer();
    const res = await request(server.app).get('/not-found');
    expect(res.body).toEqual({
      apiVersion: '1.0',
      id: expect.any(String),
      error: {
        code: 404,
        message: 'Not found',
      },
    });
    expect(res.status).toBe(404);
  });
});
