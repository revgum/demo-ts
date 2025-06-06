import { invoke } from '../invoke';
import type { InvokeArgs } from '../invoke/types';
import { get } from '../state';
import type { StateGetArgs } from '../state/types';
import type { Context } from '../types';

type ItemWithId = {
  id?: string | number;
};

type DataWithItem = { data: ItemWithId };

export type FetchArgs<K, A extends string> = {
  context: Context<K>;
  cacheArgs: Omit<StateGetArgs<K>, 'context'>;
  serviceArgs: Omit<InvokeArgs<K, A>, 'context'>;
};

/**
 * Fetch data from cache and fallback to a service invocation endpoint. The idea here is that
 * the service invocation endpoint would query the data from persistence and save it in cache
 * before returning data in the response.
 *
 * Example usage:
 * - `fetched` is null if data is not found in cache or service invocation
 *
 *  const todoId = 'ec59f080-3227-4db9-af61-c39f6284f8f6';
 *  const stateName = StateNames.REDIS;
 *  const fetched = await fetch<ContextKind, AppId, Todo>({
 *    context,
 *    cacheArgs: {
 *      stateName,
 *      key: cacheKey(stateName, todoId),
 *    },
 *    serviceArgs: {
 *      appId: 'backend-ts',
 *      method: HttpMethod.GET,
 *      methodName: `/api/v1/todos/${todoId}`,
 *      options: {
 *        headers: {
 *          Authorization: `Bearer ${context.requestToken}`,
 *        },
 *      },
 *    },
 *  });
 */
export const fetch = async <K, A extends string, V extends ItemWithId>({
  context,
  cacheArgs,
  serviceArgs,
}: FetchArgs<K, A>): Promise<V | null> => {
  const stateMeta = { stateName: cacheArgs.stateName, stateKey: cacheArgs.key };

  try {
    const cached = (await get({ context, ...cacheArgs })) as V;
    if (cached) {
      context.logger.info({ ...stateMeta, stateDataId: cached.id }, 'Cache hit');
      return cached;
    }
  } catch (err) {
    const error = err as any;
    const message = error.error_msg?.message || error.message;
    context.logger.error({ ...stateMeta, stateError: message }, 'Cache response error');
  }

  const invokeMeta = {
    invokeAppId: serviceArgs.appId,
    invokeMethodName: serviceArgs.methodName,
    invokeMethod: serviceArgs.method,
  };
  try {
    context.logger.info(stateMeta, 'Cache miss');
    const response = (await invoke({ context, ...serviceArgs })) as DataWithItem;
    context.logger.info(
      { ...invokeMeta, invokeDataId: response.data?.id },
      'Service returned data',
    );
    return response.data as V;
  } catch (err) {
    context.logger.error({ ...invokeMeta, invokeError: err }, 'Service response error');
    return null;
  }
};
