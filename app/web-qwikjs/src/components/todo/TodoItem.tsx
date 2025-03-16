import { $, component$, useSignal } from '@builder.io/qwik';
import {
  MatCancelFilled,
  MatCheckCircleFilled,
  MatEditFilled,
  MatTaskOutlined,
  MatTodayFilled,
} from '@qwikest/icons/material';
import cn from 'classnames';
import { useDeleteTodo, useUpdateTodo } from '~/routes/todos/layout';
import type { Todo } from '~/types';
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
      return (
        <>
          <MatTaskOutlined />
          <span class="ml-1">{todo.updated_at.substring(0, 10)}</span>
        </>
      );
    }
    if (todo.due_at) {
      return (
        <>
          <MatTodayFilled />
          <span class="ml-1">{todo.due_at.substring(0, 10)}</span>
        </>
      );
    }
    return 'No due date.';
  };

  return (
    <div>
      <TodoModal show={show} todo={todo} />
      <div
        class={cn(
          'flex items-center justify-between p-2 transition-opacity',
          todo.completed ? 'opacity-50' : 'opacity-100',
        )}
      >
        <div>
          <h3 class="text-lg font-medium">{todo.title}</h3>
          <div class="flex flex-row items-center text-sm text-gray-400">{getDate()}</div>
        </div>
        <div class="relative inline-flex h-6 w-fit items-center text-2xl pl-2">
          <button
            type="button"
            onClick$={() => handleToggle(todo)}
            class={todo.completed ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}
          >
            <MatCheckCircleFilled />
          </button>
          <MatEditFilled
            class="cursor-pointer"
            onClick$={() => {
              show.value = true;
            }}
          />
          <button type="button" onClick$={() => handleDelete(todo)} class="text-red-500">
            <MatCancelFilled />
          </button>
        </div>
      </div>
    </div>
  );
});
