import { buildDaprClient } from '@/lib/shared/dapr';
import type { InvokeArgs } from './types';

/**
 * Invoke another microservice.
 *
 * ex.
 *  await invoke<ContextKind, AppId>({
 *    context,
 *    appId: 'backend-ts',
 *    methodName: '/api/v1/todos',
 *    method: HttpMethod.GET,
 *    options: {
 *      headers: {
 *        Authorization: `Bearer ${context.requestToken}`,
 *      },
 *  });
 */
export const invoke = async <K, A extends string>({
  context,
  appId,
  methodName,
  method,
  data,
  options,
}: InvokeArgs<K, A>) => {
  const daprClient = buildDaprClient(context);
  return daprClient.invoker.invoke(appId, methodName, method, data, options);
};
