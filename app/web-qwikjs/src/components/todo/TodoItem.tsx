import { $, component$ } from '@builder.io/qwik';
import { useDeleteTodo, useUpdateTodo } from '~/routes/todos/layout';
import type { Todo } from '~/types';
import { LineMdCloseCircleFilled } from '../icons/Close';
import { LineMdSquareFilledToConfirmSquareFilledTransition } from '../icons/Confirm';

type TodoItemProps = {
  todo: Todo;
};

export default component$<TodoItemProps>(({ todo }) => {
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

  const getDate = () => {
    if (todo.completed && todo.updated_at) {
      return `Completed ${todo.updated_at.substring(0, 10)}`;
    }
    if (todo.due_at) {
      return `Due ${todo.due_at.substring(0, 10)}`;
    }
    return 'No due date.';
  };

  return (
    <div
      class={`flex items-center justify-between p-4 border-b last:border-none transition-opacity ${todo.completed ? 'opacity-50' : 'opacity-100'}`}
    >
      <div>
        <h3 class="text-lg font-medium">{todo.title}</h3>
        <p class="text-sm text-gray-500">{getDate()}</p>
      </div>
      <div class="relative inline-flex h-6 w-11 items-center text-2xl">
        <button
          type="button"
          onClick$={() => handleToggle(todo)}
          class={todo.completed ? 'text-green-500' : 'text-gray-300'}
        >
          <LineMdSquareFilledToConfirmSquareFilledTransition
            title={todo.completed ? 'Mark as todo' : 'Mark as complete'}
          />
        </button>
        <button type="button" onClick$={() => handleDelete(todo)} class="text-red-700 opacity-75 ml-2">
          <LineMdCloseCircleFilled title="Delete todo" />
        </button>
      </div>
    </div>
  );
});
