import { $, component$, useSignal } from '@builder.io/qwik';
import { MatCancelFilled, MatCheckBoxFilled, MatEditFilled } from '@qwikest/icons/material';
import { useDeleteTodo, useUpdateTodo } from '~/routes/todos/layout';
import type { Todo } from '~/types';
import { Modal } from '../ui';
import TodoModal from './TodoModal';

type TodoItemProps = {
  todo: Todo;
};

export default component$<TodoItemProps>(({ todo }) => {
  const show = useSignal(false);
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
    <Modal.Root bind:show={show} closeOnBackdropClick={false}>
      <div
        class={`flex items-start justify-between p-2 border-b last:border-none transition-opacity ${todo.completed ? 'opacity-50' : 'opacity-100'}`}
      >
        <TodoModal show={show} todo={todo} />
        <div>
          <Modal.Trigger class="text-left">
            <h3 class="text-lg font-medium">{todo.title}</h3>
          </Modal.Trigger>
          <p class="text-sm text-gray-500">{getDate()}</p>
        </div>
        <div class="relative inline-flex h-6 w-fit items-center text-2xl pl-2">
          <button
            type="button"
            onClick$={() => handleToggle(todo)}
            class={todo.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}
          >
            <MatCheckBoxFilled>Delete</MatCheckBoxFilled>
          </button>
          <Modal.Trigger class="text-gray-300 hover:text-gray-900 mr-2">
            <MatEditFilled>Edit</MatEditFilled>
          </Modal.Trigger>
          <button type="button" onClick$={() => handleDelete(todo)} class="text-red-500">
            <MatCancelFilled>Delete</MatCancelFilled>
          </button>
        </div>
      </div>
    </Modal.Root>
  );
});
