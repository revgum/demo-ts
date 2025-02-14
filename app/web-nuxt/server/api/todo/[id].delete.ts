import { deleteById } from '../../services/backend-dotnet';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string;
  const response = await deleteById(id);
  return { response };
});
