import type {
  TodoCreateSchema,
  TodoDbSchema,
  TodoQueryFields,
  TodoSchema,
  TodoUpdateSchema,
} from '@/schemas/todo';
import type { z } from 'zod';

export const ContextKinds = { UNKNOWN: 'unknown', TODO: 'todo' } as const;
export type ContextKind = (typeof ContextKinds)[keyof typeof ContextKinds];

export type TodoDb = z.infer<typeof TodoDbSchema>;
export type TodoQueryField = (typeof TodoQueryFields)[number];
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoModel = z.infer<typeof TodoCreateSchema>;
export type UpdateTodoModel = z.infer<typeof TodoUpdateSchema>;
