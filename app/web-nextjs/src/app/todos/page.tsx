import { verifySession } from '@/app/lib/session';
import { getAll } from '@/services/backend-ts';

export default async function Page() {
  const { token } = await verifySession();
  const allTodos = await getAll(token);
  console.log(allTodos);
  return (
    <ul>
      <li>All Todos updates</li>
      {allTodos.data.items.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
