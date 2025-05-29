import type { Response } from 'express';
import {
  EndpointsFactory,
  getMessageFromError,
  InputValidationError,
  ResultHandler,
  type FlatObject,
} from 'express-zod-api';
import type { BaseLogger } from 'pino';
import { z } from 'zod';
import { createCounter, createTimer } from '../metrics';
import type { Context } from '../types';

type ConsumerOptions<K> = {
  context: Context<K>;
  consumerStart: number;
};

type ConsumerFactoryArgs<K> = {
  context: Context<K>;
};

type HandlerParams = {
  input: FlatObject | null;
  error: Error | null;
  output: FlatObject | null;
  response: Response;
  options: FlatObject;
  logger: BaseLogger;
};

export const ConsumerStatuses = { SUCCESS: 'SUCCESS', RETRY: 'RETRY', DROP: 'DROP' } as const;

const consumerResultsHandler = <K>({ context }: ConsumerFactoryArgs<K>) =>
  new ResultHandler({
    positive: () => {
      return {
        schema: z.object({ status: z.enum([ConsumerStatuses.SUCCESS, ConsumerStatuses.RETRY]) }),
        mimeType: 'application/json',
      };
    },
    negative: () => ({
      schema: z.object({ status: z.enum([ConsumerStatuses.DROP]) }),
      mimeType: 'application/json',
    }),
    handler: (params: HandlerParams) => {
      const { error, output, response, logger } = params;
      const { consumerStart } = params.options as ConsumerOptions<K>;
      const counter = createCounter(context);
      const timer = createTimer(context);

      try {
        if (error) {
          throw error;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.json({ ...(output as any) });
      } catch (err: unknown) {
        const error = err as Error | InputValidationError;
        logger.error(getMessageFromError(error));

        createCounter(context as any).add(1, {
          status: ConsumerStatuses.DROP,
          inputValidationError: error instanceof InputValidationError,
        });
        return void response.json({
          status: ConsumerStatuses.DROP,
        });
      } finally {
        const metricAttributes = {
          status: params.output?.status,
          pubsubname: params.input?.pubsubname,
          topic: params.input?.topic,
          source: params.input?.source,
        };
        counter.add(1, metricAttributes);
        timer.record(performance.now() - consumerStart, metricAttributes);
      }
    },
  });

export const consumersFactory = <K>(args: ConsumerFactoryArgs<K>) =>
  new EndpointsFactory(consumerResultsHandler(args))
    /**
     * For every message, inject options to every handler for downstream access;
     * - context : A context for this specific handler
     * - consumerStart : The start time for this message being consumed
     */
    .addOptions<ConsumerOptions<K>>(async () => {
      return { context: args.context, consumerStart: performance.now() };
    });
