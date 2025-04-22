import { verifySession } from '@/lib/session';
import * as BackendTs from '@/services/backend-ts';

export const getAll = async () => {
  const { token } = await verifySession();
  return BackendTs.getAll(token);
};
