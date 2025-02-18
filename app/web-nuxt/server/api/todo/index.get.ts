import type { Todo } from '~/server/types';
import { getAll } from '../../services/backend-dotnet';

export default defineEventHandler(async (_event) => {
  const response = (await getAll()) as Todo[];
  // Sort by date ascending with null dates at the bottom
  const sortedByDueAt = response.sort((a, b) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    if (a.due_at === b.due_at) return 0;
    return Date.parse(a.due_at) > Date.parse(b.due_at) ? 1 : -1;
  });
  return { response: sortedByDueAt };
});
