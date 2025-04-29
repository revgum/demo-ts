import { buildHandlerContext } from '@/lib/context';
import {
  consumersFactory,
  ConsumerStatusEnum,
  ConsumerStatuses,
  createDataSchema,
  type ConsumerStatus,
} from '@/lib/shared/consumer';
import { createCounter, createTimer } from '@/lib/shared/metrics';
import { TodoSchema } from '@/schemas/todo';
import { ContextKinds, type ContextKind } from '@/types';
import { z } from 'zod';

const context = buildHandlerContext<ContextKind>({
  kind: ContextKinds.TODO,
  handlerName: 'todo-consumer',
});

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
export const handleMessage = consumersFactory({ context }).build({
  method: 'post',
  input: createDataSchema(TodoSchema),
  output: z.object({ status: ConsumerStatusEnum }),
  handler: async ({ input, logger, options: { context } }) => {
    const { pubsubname, topic, source } = input;
    let status: ConsumerStatus = ConsumerStatuses.SUCCESS;
    const counter = createCounter(context);
    const timer = createTimer(context);
    const start = performance.now();
    try {
      logger.info({ input }, 'Consumer handling message.');
      // TODO: Do something with the message
      return { status };
    } catch (err) {
      status = ConsumerStatuses.DROP;
      logger.error({ err }, 'Error processing message.');
      return { status };
    } finally {
      const metricAttributes = { status, pubsubname, topic, source };
      counter.add(1, metricAttributes);
      timer.record(performance.now() - start, metricAttributes);
    }
  },
});
