import { component$ } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';
import { useTodos } from '~/routes/todos/layout';
import TodoItem from './TodoItem';

export default component$(() => {
  const todos = useTodos();
  const hasTodos = todos.value.length;

  return (
    <div class={cn(
      hasTodos ? "bg-white rounded-lg shadow-lg" : "",
      "w-full md:w-[700px] min-w-[400px] md:max-w-3xl mt-6 p-4 rounded-lg")}>
      {hasTodos ? (
        todos.value.map((t, i, arr) => (<>
          <TodoItem key={t.id} todo={t} />
          {i < arr.length - 1 && (
            <hr key={cn(t.id, "hr")} class="w-[80%] ml-[10%] mt-2 h-[1px] border-gray-200" />
          )}

        </>))
      ) : (
        <h3 class="text-center text-lg font-regular text-gray-500">No tasks found, add a new task.</h3>
      )}
    </div>
  );
});
