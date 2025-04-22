import { DaprClient } from '@dapr/dapr';

const daprHost = process.env.DAPR_HOST || 'localhost';
const daprPort = process.env.DAPR_PORT || '3500';

let client: DaprClient | null = null;

export default (): DaprClient => {
  if (!client) {
    client = new DaprClient({
      daprHost,
      daprPort,
    });
  }
  return client;
};
