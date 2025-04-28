import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import * as node_mocks_http from 'node-mocks-http';
import type { Logger } from 'pino';
import { expect, vi } from 'vitest';

export const mockedLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  fatal: vi.fn(),
  trace: vi.fn(),
  child: vi.fn(),
} as unknown as Logger;

export const getAuthHeader = (userId: string) => {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!JWT_SECRET_KEY) throw new Error('Test server configuration error, missing JWT signing key.');

  const payload = {
    sub: userId,
  };
  const token = jwt.sign(payload, JWT_SECRET_KEY);
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const expectApiDataResponse = (
  res: node_mocks_http.MockResponse<Response<any, Record<string, any>>>,
  data: unknown,
) => {
  expect(res._getStatusCode()).toBe(200);
  expect(res._getJSONData()).toMatchObject({
    apiVersion: '1.0',
    data,
  });
};

export const expectApiError = (
  res: node_mocks_http.MockResponse<Response<any, Record<string, any>>>,
  code = 500,
  message = 'Database error',
) => {
  expect(res._getStatusCode()).toBe(code);
  expect(res._getJSONData()).toMatchObject({
    error: { code, message },
  });
};

export const expectConsumerDataResponse = (
  res: node_mocks_http.MockResponse<Response<any, Record<string, any>>>,
  data: object,
) => {
  expect(res._getStatusCode()).toBe(200);
  expect(res._getJSONData()).toMatchObject({
    ...data,
  });
};
