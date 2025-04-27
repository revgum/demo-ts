import type { Context } from '@/types';
import { CommunicationProtocolEnum, DaprServer } from '@dapr/dapr';
import type { Express } from 'express';

let server: DaprServer | null = null;

export const buildDaprServer = (context: Context, app: Express): DaprServer => {
  if (!server) {
    server = new DaprServer({
      serverHost: context.server.host,
      serverPort: context.server.port,
      serverHttp: app,
      communicationProtocol: CommunicationProtocolEnum.HTTP,
      clientOptions: {
        daprHost: context.dapr.host,
        daprPort: context.dapr.port,
      },
    });
  }
  return server;
};
