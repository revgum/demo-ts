import TodoList from '@/components/todo/todo-list';
import { getAll } from '@/services/todo';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: getAll,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoList />
    </HydrationBoundary>
  );
}
