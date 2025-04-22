'use client';

import type { Todo } from '@/types';
// import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

export default function TodoList() {
  // One option is to build an API route that returns the data for if/when
  // the client side hydration fails or cache is stale.
  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: async (): Promise<{ data: { items: Todo[] } }> => {
      console.log('Fetching todos client side..');
      return fetch('/api/todos').then((res) => res.json());
    },
  });

  /*
  // Another option is to use the queryClient to get the data from the cache or "null" if the cache
  // is cleared or becomes stale on the client side.
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData(['todos']) as { data: { items: Todo[] } };
  */

  return (
    <ul>
      <li>All Todos updates</li>
      {data?.data.items.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
