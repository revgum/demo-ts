import { ApiPayloadSchema } from '@/lib/shared/api/schemas';
import type { ApiDataPayload, ApiErrorPayload } from '@/lib/shared/api/types';
import { type ZodType, z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataResponseSchema = <T extends ZodType<any>>(itemSchema: T) =>
  z
    .object({
      data: z.union([
        itemSchema,
        z.object({
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

export const buildItemsResponse = <T>(
  schema: ZodType<T>,
  context: { api: { version: string; kind: string } },
  payload: T[],
): ApiDataPayload => {
  const dataPayload = { data: { items: payload.map((p) => ({ kind: context.api.kind, ...p })) } };
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
