import { buildDaprServer } from '@/lib/shared/dapr';
import { buildServer } from '@/server';
import type { ContextKind } from '@/types';

const startServer = async () => {
  const { server, context } = await buildServer();
  const daprServer = buildDaprServer<ContextKind>(context, server.app);
  await daprServer.start();
};

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
