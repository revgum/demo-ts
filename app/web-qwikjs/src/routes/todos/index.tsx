import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import TodoForm from '~/components/todo/TodoForm';
import TodoList from '~/components/todo/TodoList';

// (Server-side) Render the route/page and return it to the client.
export default component$(() => {
  return (
    <div class="w-full min-h-screen min-w-sm bg-gray-200 flex flex-col items-center">
      <nav class="w-full bg-blue-600 text-white py-4 px-6 text-lg font-semibold shadow-lg text-center">Todo App</nav>
      <div class="w-full flex flex-col items-center min-w-sm md:w-[700px] px-4">
        <div class="w-full min-w-sm max-w-sm mt-6 bg-white p-4 rounded-lg shadow-lg">
          <TodoForm />
        </div>
        <hr class="w-full max-w-lg h-[1px] border-gray-300 mb-1 mt-8" />
        <TodoList />
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
