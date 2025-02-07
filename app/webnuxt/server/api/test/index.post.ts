import { create } from '../../services/test';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const response = await create(body);
  return { response };
});
