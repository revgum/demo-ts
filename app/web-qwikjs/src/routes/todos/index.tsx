import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import TodoForm from '~/components/todo/TodoForm';
import TodoList from '~/components/todo/TodoList';

// (Server-side) Render the route/page and return it to the client.
export default component$(() => {
  return (
    <div class="min-h-screen w-full min-w-[400px] bg-gray-200 flex flex-col items-center">
      <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
      <div class="px-4 min-w-[400px]">
        <div class="w-full min-w-[400px] md:max-w-3xl mt-6 bg-white p-4 rounded-lg shadow-lg">
          <TodoForm />
        </div>
        <div class="w-full min-w-[400px] md:max-w-3xl mt-6 bg-white p-4 rounded-lg shadow-lg">
          <TodoList />
        </div>
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
