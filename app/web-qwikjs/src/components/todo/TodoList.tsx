import { component$ } from '@builder.io/qwik';
import { useTodos } from '~/routes/todos/layout';
import TodoItem from './TodoItem';

export default component$(() => {
  const todos = useTodos();

  return (
    <>
      {todos.value.length ? (
        todos.value.map((t) => <TodoItem key={t.id} todo={t} />)
      ) : (
        <h3 class="text-lg font-medium text-slate-700">No tasks found, add a new task.</h3>
      )}
    </>
  );
});
