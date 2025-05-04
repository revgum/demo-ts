import {
  consumersFactory,
  ConsumerStatusEnum,
  ConsumerStatuses,
  createDataSchema,
  type ConsumerStatus,
} from '@/lib/shared/consumer';
import { buildHandlerContext } from '@/lib/shared/context';
import type { Context } from '@/lib/shared/types';
import { TodoSchema } from '@/schemas/todo';
import { ContextKinds, type ContextKind } from '@/types';
import { z } from 'zod';

const todoConsumerFactory = (context: Context<ContextKind>, handlerEndpoint: string) => {
  const consumerContext = buildHandlerContext(
    {
      apiKind: ContextKinds.TODO,
      handlerName: 'todo-consumer',
      handlerEndpoint,
    },
    context,
  );
  return consumersFactory({ context: consumerContext });
};

/**
 * Event message consumer endpoint.
 *
 * - Pubsub subscriptions are defined in dapr/components/subscriptions.yaml
 * - Service main.ts defines the matching route pointing to this handler
 * - Consumer handlers must use 'post' method
 * - Consumer input schema extends a base data schema to include this pubsub topics
 *    expected data payloads. Additional unspecified fields included in the data payloads
 *    are stripped during input validation.
 * - Consumers return status options:
 *   a. "SUCCESS" marks the message as processed
 *   b. "RETRY" marks the message for reprocessing
 *   c. "DROP" drops the message from the queue and will not retry processing
 */
export const handleMessage = (context: Context<ContextKind>) =>
  todoConsumerFactory(context, 'todo.handle-message').build({
    method: 'post',
    input: createDataSchema(TodoSchema),
    output: z.object({ status: ConsumerStatusEnum }),
    handler: async ({ input, logger }) => {
      let status: ConsumerStatus = ConsumerStatuses.SUCCESS;
      try {
        logger.info({ input }, 'Consumer handling message.');
        // TODO: Do something with the message
        return { status };
      } catch (err) {
        status = ConsumerStatuses.DROP;
        logger.error({ err }, 'Error processing message.');
        return { status };
      }
    },
  });
