import { updateById } from '../../services/backend-dotnet';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string;
  const body = await readBody(event);
  const response = await updateById(id, body);
  return { response };
});
