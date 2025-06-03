import type { JwtPayload } from 'jsonwebtoken';
import type { z } from 'zod';
import type { ApiPayloadSchema, ErrorPayloadSchema, SuccessPayloadSchema } from '.';
import type { User } from '../types';

export type GetJwtUser<C> = (context: C, payload: JwtPayload) => Promise<{ user: User }>;

export type ApiPayload = z.infer<typeof ApiPayloadSchema>;
export type ApiDataPayload = z.infer<typeof SuccessPayloadSchema>;
export type ApiErrorPayload = z.infer<typeof ErrorPayloadSchema>;

export type QueryOrderDirection = 'asc' | 'desc';
export type QueryParams<F> = {
  page?: number;
  pageSize?: number;
  orderBy?: F;
  orderDirection?: QueryOrderDirection;
};
export type PaginatedQueryResults<M, F> = {
  orderBy: F;
  orderDirection: QueryOrderDirection;
  totalItems: number; // Total number of records in result set
  totalPages: number; // Total number of pages in result set
  itemsPerPage: number; // Maximum size of each page
  currentItemCount: number; // Number of items in this page
  pageIndex: number; // The current page index returned
  items: M[];
};
