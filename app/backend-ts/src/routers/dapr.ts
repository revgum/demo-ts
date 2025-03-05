import { type Request, type Response, Router } from 'express';

export const DaprRouter = () => {
  const router = Router({ mergeParams: true });
  router.get('/metadata', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
  return router;
};
