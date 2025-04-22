import { dapr } from '@/config';
import { DaprClient } from '@dapr/dapr';

export const daprClient = new DaprClient({ daprHost: dapr.host, daprPort: dapr.port });
