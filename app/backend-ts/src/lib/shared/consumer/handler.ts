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
import { createCounter } from '../metrics';
import type { Context } from '../types';

type ConsumerOptions<K> = {
  context: Context<K>;
};

export const ConsumerStatuses = { SUCCESS: 'SUCCESS', RETRY: 'RETRY', DROP: 'DROP' } as const;

const consumerResultsHandler = <K>(context: Context<K>) =>
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
    handler: (params: {
      input: FlatObject | null;
      error: Error | null;
      output: FlatObject | null;
      response: Response;
      options: FlatObject;
      logger: BaseLogger;
    }) => {
      const { error, output, response, input, logger } = params;
      const {
        api: { kind },
      } = context;

      if (error) {
        const counter = createCounter(
          context as any,
          kind as string,
          `${kind}-consumer-handler-error`,
        );
        const { id, traceid, traceparent, source, topic, pubsubname } = input as any;

        const inputValidationError = error instanceof InputValidationError;
        logger.error(
          { id, traceid, traceparent, source, topic, pubsubname },
          getMessageFromError(error),
        );

        counter.add(1, { success: false, inputValidationError, pubsubname, topic, source });
        return void response.json({
          status: ConsumerStatuses.DROP,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.json({ ...(output as any) });
    },
  });

export const consumersFactory = <K>(context: Context<K>, kind: K) =>
  new EndpointsFactory(consumerResultsHandler(context))
    /**
     * For every message, inject options to every handler for downstream access;
     * - context.api.kind : The data "kind" for the handler built by the factory
     */
    .addOptions<ConsumerOptions<K>>(async () => {
      return {
        context: {
          ...context,
          api: {
            ...context.api,
            kind,
          },
        },
      };
    });
