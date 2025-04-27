import {
  consumersFactory,
  ConsumerStatusEnum,
  ConsumerStatuses,
  createDataSchema,
} from '@/lib/shared/consumer';
import { TodoSchema } from '@/schemas/todo';
import { z } from 'zod';

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
export const handleTodo = consumersFactory().build({
  method: 'post',
  input: createDataSchema(TodoSchema),
  output: z.object({ status: ConsumerStatusEnum }),
  handler: async ({ input, logger }) => {
    logger.info(input, 'Consumer handled data');
    return { status: ConsumerStatuses.SUCCESS };
  },
});
