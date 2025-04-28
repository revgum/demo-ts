import { z, type ZodType } from 'zod';
import {
  ApiPayloadSchema,
  type ApiDataPayload,
  type ApiErrorPayload,
  type PaginatedQueryResults,
} from './';

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

export const buildResponse = <T>(
  schema: ZodType<T>,
  context: { api: { version: string; kind: string } },
  payload: T,
): ApiDataPayload => {
  const dataPayload = { data: { kind: context.api.kind, ...payload } };
  const dataSchema = DataResponseSchema(schema);
  const apiPayload = ApiPayloadSchema.parse({
    apiVersion: context.api.version,
    ...dataSchema.parse(dataPayload),
  });
  return apiPayload as ApiDataPayload;
};

export const buildItemsResponse = <T, M, F>(
  schema: ZodType<T>,
  context: { api: { version: string; kind: string } },
  payload: PaginatedQueryResults<M, F>,
): ApiDataPayload => {
  const dataPayload = {
    data: {
      ...payload,
      items: payload.items.map((p) => ({ kind: context.api.kind, ...p })),
    },
  };
  const dataSchema = DataResponseSchema(schema);
  const apiPayload = ApiPayloadSchema.parse({
    apiVersion: context.api.version,
    ...dataSchema.parse(dataPayload),
  });
  return apiPayload as ApiDataPayload;
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
