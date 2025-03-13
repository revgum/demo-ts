import { routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city';
import type { InitialValues } from '@modular-forms/qwik';
import type { TodoForm } from '~/components/todo/TodoForm';
import { deleteById, getAll, updateById } from '~/services/backend-ts';

// (Server-side) When accessing this route/page, fetch all of the Todo items and
// sort them in a logical fashion.
export const useTodos = routeLoader$(async (_requestEvent) => {
  const { payload } = await getAll();
  // Sort by date ascending with null dates at the bottom
  const sortedByDueAt = payload.sort((a, b) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    if (a.due_at === b.due_at) return 0;
    return Date.parse(a.due_at) > Date.parse(b.due_at) ? 1 : -1;
  });
  return sortedByDueAt;
});

// (Server-side) Preset the "Add Task" form with default values.
export const useFormLoader = routeLoader$<InitialValues<TodoForm>>(() => ({
  title: '',
  due_at: null,
}));

// (Server-side) Validate that the dynamic "form" posted includes Todo fields necessary
// to perform updates before calling the microservice to update it.
export const useUpdateTodo = routeAction$(
  async (t) => {
    const { id, ...rest } = t;
    const { payload } = await updateById(id, rest);
    return payload;
  },
  zod$({
    id: z.string(),
    title: z.string().optional(),
    due_at: z.string().optional().nullable(),
    completed: z.boolean().optional(),
  }),
);

// (Server-side) Validate that the dynamic "form" posted includes the Todo ID before attempting to
// calling the microservice to delete it.
export const useDeleteTodo = routeAction$(
  async (t) => {
    const { id } = t;
    const { payload } = await deleteById(id);
    return payload;
  },
  zod$({
    id: z.string(),
  }),
);
