import { AuthMiddleware } from '@/lib/shared/api/middlewares/auth';
import { ErrorPayloadSchema, createSuccessPayloadSchema } from '@/lib/shared/api/schemas';
import type { Response } from 'express';
import {
  EndpointsFactory,
  type FlatObject,
  ResultHandler,
  ensureHttpError,
  getMessageFromError,
} from 'express-zod-api';
import helmet from 'helmet';
import createHttpError from 'http-errors';
import { randomUUID } from 'node:crypto';
import type { ZodTypeAny } from 'zod';

type EndpointOptions<C = unknown> = {
  context: C;
  requestId: string; // UUID v4 for this request
};

/**
 * Creates a result handler for API responses, supporting both success and error scenarios.
 *
 * @template T - The Zod schema type used to validate the success payload.
 * @template C - The context type for the endpoint options.
 *
 * @param itemSchema - A Zod schema defining the structure of the success payload.
 * @param kind - A string representing the kind of the API data response.
 *
 * @returns An instance of `ResultHandler` configured to handle API responses.
 *
 * ### Success Handling:
 * - The `positive` handler defines the schema and MIME type for successful responses.
 * - The success payload schema is created using `createSuccessPayloadSchema` with the provided `itemSchema` and `kind`.
 *
 * ### Error Handling:
 * - The `negative` handler defines the schema and MIME type for error responses.
 * - Errors are structured using the `ErrorPayloadSchema`.
 *
 * ### Handler Logic:
 * - If an error occurs:
 *   - The error is processed using `ensureHttpError` to extract the status code and exposure flag.
 *   - In production environments, sensitive error messages are scrubbed unless explicitly exposed.
 *   - The response includes the API version, error code, and error message.
 * - If no error occurs:
 *   - The response includes the standard API payload.
 *
 * ### Notes:
 * - Zod validation errors are aggregated into a single message for easier debugging.
 * - In production, unhandled errors are sanitized to prevent leaking sensitive information.
 * - Explicitly setting `expose: true` when throwing an error with `createHttpError` will include the error message in the response.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiResultsHandler = <T extends ZodTypeAny, C = any>(itemSchema: T, kind: string) =>
  new ResultHandler({
    positive: (_) => {
      return {
        schema: createSuccessPayloadSchema(itemSchema, [kind]),
        mimeType: 'application/json',
      };
    },
    negative: () => ({
      schema: ErrorPayloadSchema,
      mimeType: 'application/json',
    }),
    handler: (params: {
      error: Error | null;
      output: FlatObject | null;
      response: Response;
      options: FlatObject;
    }) => {
      const { context, requestId } = params.options as EndpointOptions<C>;
      const { error, output, response } = params;

      if (error) {
        const { statusCode, expose } = ensureHttpError(error);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shouldScrub = (context as any)?.env === 'production' && !expose;
        const message = shouldScrub ? createHttpError(statusCode).message : getMessageFromError(error);
        return void response.status(statusCode).json({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          apiVersion: (context as any)?.api.version,
          id: requestId,
          error: {
            code: statusCode,
            message,
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.json({ id: requestId, ...(output as any) });
    },
  });

/**
 * Creates an instance of `EndpointsFactory` with the provided context, kind, and item schema.
 * This factory is used to define API endpoints with additional options and context.
 *
 * @template C - The type of the context object.
 * @template T - The type of the item schema, extending `ZodTypeAny`.
 *
 * @param context - The base context object to be used in the endpoints.
 * @param kind - A string representing the kind or category of the endpoint.
 * @param itemSchema - A Zod schema defining the structure of the items handled by the endpoint.
 *
 * @returns An instance of `EndpointsFactory` configured with the provided context, kind, and item schema.
 */
export const endpointsFactory = <C, T extends ZodTypeAny>(context: C, kind: string, itemSchema: T) =>
  new EndpointsFactory(apiResultsHandler(itemSchema, kind))
    .addExpressMiddleware(helmet())
    .addOptions<EndpointOptions<C>>(async () => {
      return {
        requestId: randomUUID(),
        context: {
          ...context,
          api: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(context as any).api,
            kind,
          },
        },
      };
    })
    .addMiddleware(AuthMiddleware);
