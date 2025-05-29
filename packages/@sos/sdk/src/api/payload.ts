import { z, type ZodType } from 'zod';
import {
  ApiPayloadSchema,
  type ApiDataPayload,
  type ApiErrorPayload,
  type PaginatedQueryResults,
} from '../api';

// Type guard to check if payload is a paginated result
const isPaginated = <M, F>(payload: any): payload is PaginatedQueryResults<M, F> =>
  Array.isArray(payload?.items);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataResponseSchema = <T extends ZodType<any>>(itemSchema: T) =>
  z
    .object({
      data: z.union([
        itemSchema,
        z.object({
          orderBy: z.string().optional(),
          orderDirection: z.string().optional(),
          pageIndex: z.number().optional(),
          totalPages: z.number().optional(),
          itemsPerPage: z.number().optional(),
          totalItems: z.number().optional(),
          currentItemCount: z.number().optional(),
          items: z.array(itemSchema),
        }),
      ]),
    })
    .passthrough();

/**
 * Builds a standardized API response from a single object or a paginated list.
 *
 * @param schema - Zod schema to validate items
 * @param context - Context containing API metadata (version and kind)
 * @param payload - Either a paginated list of items or a single item
 * @returns A validated API response object
 */
export const buildResponse = <T, M, F>(
  schema: ZodType<T>,
  context: { api: { version: string; kind: string } },
  payload: PaginatedQueryResults<M, F> | T,
): ApiDataPayload => {
  const data = isPaginated<M, F>(payload)
    ? {
        ...payload,
        items: payload.items.map((item) => ({
          kind: context.api.kind,
          ...item,
        })),
      }
    : {
        ...payload,
        kind: context.api.kind,
      };

  // Validate the inner data structure using the schema
  const dataSchema = DataResponseSchema(schema);
  const validatedData = dataSchema.parse({ data });

  // Wrap with API metadata and validate full structure
  return ApiPayloadSchema.parse({
    apiVersion: context.api.version,
    ...validatedData,
  }) as ApiDataPayload;
};

export const buildErrorResponse = (payload: ApiErrorPayload) => ApiPayloadSchema.parse(payload);

export const buildServerErrorResponse = (
  context: { api: { version: string } },
  message: string,
  code = 500,
) =>
  buildErrorResponse({
    apiVersion: context.api.version,
    error: {
      code,
      message,
    },
  });
