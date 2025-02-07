import { getAll } from '../../services/test';

export default defineEventHandler(async (_event) => {
  const response = await getAll();
  return { response };
});
