import { $, component$, useStore } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$ } from '@builder.io/qwik-city';
import { type InitialValues, type SubmitHandler, formAction$, reset, useForm, valiForm$ } from '@modular-forms/qwik';
import * as v from 'valibot';

const TaskSchema = v.object({
  title: v.string(),
  dueDate: v.string(),
});
type TaskForm = v.InferInput<typeof TaskSchema>;
type Task = v.InferInput<typeof TaskSchema> & { id: number; completed: boolean };

export const useFormLoader = routeLoader$<InitialValues<TaskForm>>(() => ({
  title: '',
  dueDate: '',
  id: 0,
  completed: false,
}));

export const useFormAction = formAction$<TaskForm>((values) => {
  // Runs on server
  console.log(values);
  // tasks.push({ id: 4, title: values.title, dueDate: values.dueDate, completed: false });
}, valiForm$(TaskSchema));

export default component$(() => {
  const [taskForm, { Form, Field }] = useForm<TaskForm>({
    loader: useFormLoader(),
    // action: useFormAction(),
    validate: valiForm$(TaskSchema),
  });

  const store = useStore<{ tasks: Task[] }>({
    tasks: [],
  });

  const handleSubmit = $<SubmitHandler<TaskForm>>((values) => {
    let newId = 1;
    if (store.tasks.length) {
      newId =
        store.tasks
          .map((t) => t.id)
          .sort()
          .reverse()[0] + 1;
    }
    store.tasks.push({ id: newId, title: values.title, dueDate: values.dueDate, completed: false });
    reset(taskForm);
  });

  const toggleTask = $((id: number) => {
    const task = store.tasks.find((task) => task.id === id);
    if (task) task.completed = !task.completed;
  });

  return (
    <div class="min-h-screen w-full bg-gray-200 flex flex-col items-center">
      <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
      <div class="w-full max-w-lg mt-6 bg-white p-4 rounded-xl shadow-lg">
        <Form onSubmit$={handleSubmit} class="mb-4 flex flex-col gap-2">
          <Field name="title">
            {(field, props) => (
              <input {...props} type="text" value={field.value} class="p-2 border rounded-md w-full" />
            )}
          </Field>
          <Field name="dueDate">
            {(field, props) => (
              <input {...props} type="date" value={field.value} class="p-2 border rounded-md w-full" />
            )}
          </Field>
          <button type="submit" class="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            Add Task
          </button>
        </Form>
        {store.tasks.map((task) => (
          <div
            key={task.id}
            class={`flex items-center justify-between p-4 border-b last:border-none transition-opacity ${task.completed ? 'opacity-50' : 'opacity-100'}`}
          >
            <div>
              <h3 class="text-lg font-medium">{task.title}</h3>
              <p class="text-sm text-gray-500">Due: {task.dueDate}</p>
            </div>
            <button
              type="button"
              onClick$={() => toggleTask(task.id)}
              class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span
                class={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform ${task.completed ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
