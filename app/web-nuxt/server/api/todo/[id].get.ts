import { getById } from '../../services/backend-dotnet';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string;
  const response = await getById(id);
  return { response };
});
