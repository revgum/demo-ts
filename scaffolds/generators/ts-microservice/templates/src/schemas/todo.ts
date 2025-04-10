import { createDataSchema } from '@/lib/shared/api/schemas';
import { ContextKinds } from '@/types';
import { ez } from 'express-zod-api';
import { z } from 'zod';

export const TodoDbSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).trim(),
  completed: z.boolean().default(false),
  created_at: z.date(),
  due_at: z.date().nullish(),
  deleted_at: z.date().nullish(),
  updated_at: z.date().nullish(),
});

export const TodoSchema = z.object({
  id: z.string().uuid(),
  kind: z.literal('todo'),
  title: z.string().min(1).trim(),
  completed: z.boolean().default(false).nullish(),
  createdAt: z.string().datetime(),
  dueAt: z.string().datetime().nullish(),
  deletedAt: z.string().datetime().nullish(),
  updatedAt: z.string().datetime().nullish(),
});

// Has data object with fields appropriate for creating a new Todo. ({ data }).
// dueAt can be a date or datetime string (ie. 2025-01-01, 2025-01-01T12:00:00.000Z)
export const TodoCreateSchema = TodoSchema.pick({
  title: true,
  completed: true,
})
  .merge(
    z.object({
      dueAt: z.union([ez.dateIn(), z.string().datetime()]).nullish(),
    }),
  )
  .strict();

export const TodoUpdateSchema = TodoCreateSchema;

export const TodoApiDataSchema = createDataSchema(TodoSchema, [ContextKinds.TODO]);
