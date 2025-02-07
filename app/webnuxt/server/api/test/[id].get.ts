import { getById } from '../../services/test';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string;
  const response = await getById(Number.parseInt(id, 10));
  return { response };
});
