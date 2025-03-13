import { $, component$ } from '@builder.io/qwik';
import { z } from '@builder.io/qwik-city';
import { type SubmitHandler, formAction$, reset, useForm, zodForm$ } from '@modular-forms/qwik';
import { LineMdAlertCircleLoop } from '~/components/icons/Alert';
import { useFormLoader } from '~/routes';
import { create } from '~/services/backend-ts';

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
export type TodoForm = z.infer<typeof TodoSchema>;


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

  // (Client-side) Reset the form on the client side
  const handleSubmit = $<SubmitHandler<TodoForm>>(() => {
    reset(TodoForm);
  });

  return (
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
  );
});
