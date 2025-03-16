import { $, type ClassList, type Signal, component$, useTask$ } from '@builder.io/qwik';
import { type Maybe, type SubmitHandler, reset, setValue, useForm, zodForm$ } from '@modular-forms/qwik';
import { MatReportFilled } from '@qwikest/icons/material';
import cn from 'classnames';
import { DatePicker } from 'flowbite-qwik';
import { useFormAction, useFormLoader } from '~/routes/todos/layout';
import type { Todo, TodoForm } from '~/types';
import { TodoSchema } from './schemas';

interface TodoFormProps {
  todo?: Todo;
  modalVisible?: Signal<boolean>;
  classList?: Maybe<ClassList | Signal<ClassList>>;
}

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
    <Form onSubmit$={handleButtonClick} class={cn(classList, 'flex flex-col gap-2')}>
      <Field name="id">{(field, props) => <input {...props} type="hidden" value={field.value} />}</Field>
      <Field name="title">
        {(field, props) => (
          <div>
            <input
              {...props}
              type="text"
              value={field.value}
              class={cn('p-2 border rounded-md w-full', field.error ? 'border-red-600 focus:border-red-600' : '')}
              placeholder="Todo title..."
            />
            {field.error && (
              <div class="flex items-center mt-2 p-2 text-sm text-red-600">
                <MatReportFilled />
                <span class="ml-1">{field.error}</span>
              </div>
            )}
          </div>
        )}
      </Field>
      <Field name="due_at">
        {(field) => (
          <DatePicker
            name="due_at"
            value={field.value?.substring(0, 10)}
            onSelectedDateChanged$={(selectedDate: Date) => {
              setValue(TodoForm, 'due_at', selectedDate.toISOString());
            }}
          />
        )}
      </Field>
      <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
        {todo ? 'Save' : 'Add Todo'}
      </button>
      {todo && (
        <button
          onClick$={closeModal}
          type="button"
          class="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Cancel
        </button>
      )}
    </Form>
  );
});
