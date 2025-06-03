import { buildServer } from '@/server';
import type { ContextKind } from '@/types';
import { Dapr } from '@sos/sdk';

const startServer = async () => {
  const { server, context } = await buildServer();
  const daprServer = Dapr.buildDaprServer<ContextKind>(context, server.app);
  await daprServer.start();
};

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});
