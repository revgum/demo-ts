import type { JwtPayload } from 'jsonwebtoken';
import type { z } from 'zod';
import type { ApiPayloadSchema, ErrorPayloadSchema, SuccessPayloadSchema } from './';

export type GetJwtUser<C> = (context: C, payload: JwtPayload) => Promise<{ user: User }>;
export type User = {
  id: string;
};

export type ApiPayload = z.infer<typeof ApiPayloadSchema>;
export type ApiDataPayload = z.infer<typeof SuccessPayloadSchema>;
export type ApiErrorPayload = z.infer<typeof ErrorPayloadSchema>;
