import { DaprClient } from '@dapr/dapr';
import { dapr, localDev } from './config';

export const daprClient = localDev
  ? ({
      invoker: {
        invoke: () => {},
      },
    } as unknown as DaprClient)
  : new DaprClient({ daprHost: dapr.host, daprPort: dapr.port });
