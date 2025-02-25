import { create } from '../../services/backend-dotnet';
import type { Todo } from '../../types';

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<Todo>;
  if (!body.due_at) {
    body.due_at = null;
  }
  const response = await create(body);
  return { response };
});
