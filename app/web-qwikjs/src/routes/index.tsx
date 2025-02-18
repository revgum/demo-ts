import { $, component$ } from '@builder.io/qwik';
import { type DocumentHead, routeAction$, routeLoader$, z, zod$ } from '@builder.io/qwik-city';
import { type InitialValues, type SubmitHandler, formAction$, reset, useForm, zodForm$ } from '@modular-forms/qwik';
import { LineMdAlertCircleLoop } from '~/components/icons/Alert';
import TodoList from '~/components/todo/TodoList';
import { create, deleteById, getAll, updateById } from '~/services/backend-ts';
import type { Todo } from '~/types';

const TodoSchema = z.object({
  title: z
    .string({
      required_error: 'Title required.',
    })
    .min(1, { message: 'Title must have at least 1 character.' })
    .max(256, { message: 'Title cannot exceed 256 characters.' })
    .trim(),
  due_at: z.string().optional().nullable(),
});
type TodoForm = z.infer<typeof TodoSchema>;

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

// (Server-side) Preset the "Add Task" form with default values.
export const useFormLoader = routeLoader$<InitialValues<TodoForm>>(() => ({
  title: '',
  due_at: null,
}));

// (Server-side) When the "Add Task" form is submitted to create a new Todo, run the form validation
// on the server-side.
export const useFormAction = formAction$<TodoForm>(async (values) => {
  await create(values);
}, zodForm$(TodoSchema));

// (Server-side) Render the route/page and return it to the client.
export default component$(() => {
  // Perform form validation on the "Add Task" form on the client side.
  const [TodoForm, { Form, Field }] = useForm<TodoForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: zodForm$(TodoSchema),
  });

  const todos = useTodos();
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  // (Client-side) Submit a dynamic "form" to the backend targetting the useUpdateTodo action
  const handleToggle = $(async (t: Todo) => {
    t.completed = !t.completed;
    await updateTodo.submit(t);
  });

  // (Client-side) Submit a dynamic "form" to the backend targetting the useDeleteTodo action
  const handleDelete = $(async (t: Todo) => {
    await deleteTodo.submit(t);
  });

  // (Client-side) Reset the form on the client side
  const handleSubmit = $<SubmitHandler<TodoForm>>(() => {
    reset(TodoForm);
  });

  return (
    <div class="min-h-screen w-full bg-gray-200 flex flex-col items-center">
      <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
      <div class="w-full max-w-lg mt-6 bg-white p-4 rounded-xl shadow-lg">
        <Form onSubmit$={handleSubmit} class="mb-4 flex flex-col gap-2">
          <Field name="title">
            {(field, props) => (
              <div>
                <input
                  {...props}
                  type="text"
                  value={field.value}
                  class={`p-2 border rounded-md w-full ${field.error ? 'border-red-700 focus:border-red-700' : ''} `}
                  placeholder="Task title..."
                />
                {field.error && (
                  <div class="flex items-center mt-2 p-2 text-sm text-red-700">
                    <LineMdAlertCircleLoop class="pr-1" height="1.25rem" width="1.25rem" />
                    <span>{field.error}</span>
                  </div>
                )}
              </div>
            )}
          </Field>
          <Field name="due_at">
            {(field, props) => (
              <input {...props} type="date" value={field.value} class="p-2 border rounded-md w-full" />
            )}
          </Field>
          <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Add Task
          </button>
        </Form>
        <TodoList todos={todos.value} handleDelete={handleDelete} handleToggle={handleToggle} />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Todo App',
  meta: [
    {
      name: 'description',
      content: 'description',
    },
  ],
};
