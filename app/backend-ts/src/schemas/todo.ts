import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).trim(),
  completed: z.boolean().default(false),
  created_at: z.union([z.date(), z.string().datetime()]),
  due_at: z.union([z.date(), z.string().datetime()]).nullish(),
  deleted_at: z.union([z.date(), z.string().datetime()]).nullish(),
  updated_at: z.union([z.date(), z.string().datetime()]).nullish(),
});

// Has data object with fields appropriate for creating a new Todo. ({ data }).
// due_at can be a date or datetime string (ie. 2025-01-01, 2025-01-01T12:00:00.000Z)
export const CreateTodoSchema = TodoSchema.pick({
  title: true,
  completed: true,
}).merge(
  z.object({
    due_at: z.union([z.string().date(), z.string().datetime()]).nullish(),
  }),
);

export const UpdateTodoSchema = CreateTodoSchema;

// Has either Todo object payload or error string
export const TodoResponseSchema = z.object({
  payload: TodoSchema.optional(),
  error: z.string().optional(),
});

// Has either Todo array object payload or error string
export const TodoListResponseSchema = z.object({
  payload: TodoSchema.array().optional(),
  error: z.string().optional(),
});
