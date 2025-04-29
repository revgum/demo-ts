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

type ConsumerFactoryArgs<K> = {
  context: Context<K>;
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
    handler: (params: {
      input: FlatObject | null;
      error: Error | null;
      output: FlatObject | null;
      response: Response;
      options: FlatObject;
      logger: BaseLogger;
    }) => {
      const { error, output, response, logger } = params;

      if (error) {
        const inputValidationError = error instanceof InputValidationError;
        logger.error(getMessageFromError(error));

        const counter = createCounter(context as any);
        counter.add(1, {
          status: ConsumerStatuses.DROP,
          inputValidationError,
        });
        return void response.json({
          status: ConsumerStatuses.DROP,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.json({ ...(output as any) });
    },
  });

export const consumersFactory = <K>(args: ConsumerFactoryArgs<K>) =>
  new EndpointsFactory(consumerResultsHandler(args))
    /**
     * For every message, inject options to every handler for downstream access;
     * - context : A context for this specific handler
     */
    .addOptions<ConsumerOptions<K>>(async () => {
      return { context: args.context };
    });
