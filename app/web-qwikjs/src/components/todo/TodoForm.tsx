import { $, type ClassList, type Signal, component$, useTask$ } from '@builder.io/qwik';
import { z } from '@builder.io/qwik-city';
import { type Maybe, type SubmitHandler, formAction$, reset, setValue, useForm, zodForm$ } from '@modular-forms/qwik';
import { LineMdAlertCircleLoop } from '~/components/icons/Alert';
import { useFormLoader } from '~/routes/todos/layout';
import { create, updateById } from '~/services/backend-ts';
import type { Todo } from '~/types';

interface TodoFormProps {
  todo?: Todo
  modalVisible?: Signal<boolean>;
  classList?: Maybe<ClassList | Signal<ClassList>>
}

const TodoSchema = z.object({
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
export type TodoForm = z.infer<typeof TodoSchema>;


// (Server-side) When the Todo form is submitted to create or update a Todo,
// run the form validation on the server-side.
export const useFormAction = formAction$<TodoForm>(async (values) => {
  if (values.id) {
    await updateById(values.id, values);
  } else {
    await create(values);
  }

}, zodForm$(TodoSchema));

// (Server-side) Render the route/page and return it to the client.
export default component$<TodoFormProps>(({ todo, modalVisible, classList }) => {
  // Perform form validation on the "Add Task" form on the client side.
  const [TodoForm, { Form, Field }] = useForm<TodoForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: zodForm$(TodoSchema),
  });

  useTask$(({ track }) => {
    const id = track(() => todo?.id);
    const title = track(() => todo?.title);
    const due_at = track(() => todo?.due_at);

    if (id) {
      setValue(TodoForm, 'id', id);
    }
    if (due_at) {
      setValue(TodoForm, 'due_at', due_at);
    }
    if (title) {
      setValue(TodoForm, 'title', title);
    }
  });

  const closeModal = $(() => {
    if (modalVisible) {
      modalVisible.value = false;
    }
  });

  // (Client-side) Reset the form on the client side
  const handleButtonClick = $<SubmitHandler<TodoForm>>(() => {
    reset(TodoForm);
    closeModal();
  });

  return (
    <Form onSubmit$={handleButtonClick} class={`${classList} flex flex-col gap-2`}>
      <Field name="id">
        {(field, props) => (
          <input {...props} type="hidden" value={field.value} />
        )}
      </Field>
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
        {todo ? "Save" : "Add Task"}
      </button>
      {todo && <button onClick$={closeModal} type="reset" class="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
        Cancel
      </button>
      }
    </Form>
  );
});
