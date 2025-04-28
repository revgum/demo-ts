import { context } from '@/lib/context';
import {
  consumersFactory,
  ConsumerStatusEnum,
  ConsumerStatuses,
  createDataSchema,
} from '@/lib/shared/consumer';
import { createCounter, createTimer } from '@/lib/shared/metrics';
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
export const handleMessage = consumersFactory(context, 'todo').build({
  method: 'post',
  input: createDataSchema(TodoSchema),
  output: z.object({ status: ConsumerStatusEnum }),
  handler: async ({ input, logger }) => {
    let success = false;
    const counter = createCounter(context, 'todo', 'todo-consumer');
    const timer = createTimer(context, 'todo', 'todo-consumer-ms');
    const start = performance.now();
    try {
      success = true;
      logger.info({ input }, 'Consumer handling message.');
      // TODO: Do something with the message
      return { status: ConsumerStatuses.SUCCESS };
    } catch (err) {
      logger.error({ err }, 'Error processing message.');
      return { status: ConsumerStatuses.DROP };
    } finally {
      counter.add(1, { success });
      timer.record(performance.now() - start, { success });
    }
  },
});
