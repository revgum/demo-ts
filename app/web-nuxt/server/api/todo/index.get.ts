import type { Todo } from '~/server/types';
import { getAll } from '../../services/backend-dotnet';

export default defineEventHandler(async (_event) => {
  const response = (await getAll()) as Todo[];
  const sortedByDueAt = response.sort(
    (a, b) => (b.due_at ? Date.parse(b.due_at) : -1) - (a.due_at ? Date.parse(a.due_at) : -1),
  );
  return { response: sortedByDueAt };
});
