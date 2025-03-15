import { z } from '@builder.io/qwik-city';

export const TodoSchema = z.object({
  id: z.string().optional(),
  title: z
    .string({
      required_error: 'Title required.',
    })
    .min(1, { message: 'Title must have at least 1 character.' })
    .max(256, { message: 'Title cannot exceed 256 characters.' })
    .trim(),
  due_at: z.string().optional().nullable(),
});
