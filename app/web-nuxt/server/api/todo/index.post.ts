import type { Todo } from '~/server/types';
import { create } from '../../services/backend-dotnet';

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<Todo>;
  if (!body.due_at) {
    body.due_at = null;
  }
  const response = await create(body);
  return { response };
});
