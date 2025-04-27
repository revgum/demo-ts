import type { Response } from 'express';
import {
  EndpointsFactory,
  InputValidationError,
  ResultHandler,
  type FlatObject,
} from 'express-zod-api';
import type { BaseLogger } from 'pino';
import { z } from 'zod';

export const ConsumerStatuses = { SUCCESS: 'SUCCESS', RETRY: 'RETRY', DROP: 'DROP' } as const;

const consumerResultsHandler = () =>
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

      if (error) {
        let message = error.message;
        if (error instanceof InputValidationError) {
          message = `Input validation failed, consumer received data payload with an invalid path. Error = ${error.message.replace(/^data\//, '')}`;
        }
        const { id, traceid, traceparent, source, topic, pubsubname } = input as any;
        logger.error({ id, traceid, traceparent, source, topic, pubsubname }, message);
        // TODO: Emit metrics will require passing in context
        return void response.json({
          status: ConsumerStatuses.DROP,
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.json({ ...(output as any) });
    },
  });

export const consumersFactory = () => new EndpointsFactory(consumerResultsHandler());
