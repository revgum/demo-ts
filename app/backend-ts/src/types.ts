import type {
  TodoApiDataSchema,
  TodoCreateSchema,
  TodoDbSchema,
  TodoQueryFields,
  TodoSchema,
  TodoUpdateSchema,
} from '@/schemas/todo';
import { Api } from '@sos/sdk';
import type { z } from 'zod';

export const ContextKinds = { UNKNOWN: 'unknown', TODO: 'todo' } as const;
export type ContextKind = (typeof ContextKinds)[keyof typeof ContextKinds];

export const AppIds = { BACKEND_TS: 'backend-ts' } as const;
export type AppId = (typeof AppIds)[keyof typeof AppIds];

export type Uuid = z.infer<typeof Api.UuidParamsSchema>;
export type TodoDb = z.infer<typeof TodoDbSchema>;
export type TodoQueryField = (typeof TodoQueryFields)[number];
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoModel = z.infer<typeof TodoCreateSchema>;
export type UpdateTodoModel = z.infer<typeof TodoUpdateSchema>;
export type TodoData = z.infer<typeof TodoApiDataSchema>;
