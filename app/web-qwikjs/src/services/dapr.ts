import { DaprClient } from '@dapr/dapr';
import { dapr } from '../config';

export const daprClient = new DaprClient({ daprHost: dapr.host, daprPort: dapr.port });
