import { type ZodTypeAny, z } from 'zod';

const ErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  errors: z
    .array(
      z.object({
        domain: z.string().nullish(),
        reason: z.string().nullish(),
        message: z.string().nullish(),
        location: z.string().nullish(),
        locationType: z.string().nullish(),
        extendedHelp: z.string().nullish(),
        sendReport: z.string().nullish(),
      }),
    )
    .nullish(),
});

export const createDataSchema = <T extends ZodTypeAny>(
  itemSchema: T,
  contextKinds: readonly [string, ...string[]],
) =>
  z.union([
    z.object({
      id: z.string().nullish(),
      kind: z.enum(contextKinds),
      fields: z.string().nullish(),
      etag: z.string().nullish(),
      lang: z.string().nullish(),
      updated: z.string().datetime().nullish(),
      deleted: z.boolean().nullish(),
      items: z.array(itemSchema).nullish().optional(),
    }),
    itemSchema,
  ]);

const DataSchema = z
  .object({
    id: z.string().nullish(),
    kind: z.string().nullish(),
    fields: z.string().nullish(),
    etag: z.string().nullish(),
    lang: z.string().nullish(),
    updated: z.string().datetime().nullish(),
    deleted: z.boolean().nullish(),
    items: z.array(z.record(z.string(), z.any())).nullish().optional(),
  })
  .passthrough();

export const createSuccessPayloadSchema = <T extends ZodTypeAny>(
  itemSchema: T,
  contextKinds: readonly [string, ...string[]],
) =>
  z
    .object({
      apiVersion: z.string(),
      context: z.string().nullish(),
      id: z.string().nullish(),
      method: z.string().nullish(),
      params: z.record(z.string(), z.string()).nullish(),
      data: createDataSchema(itemSchema, contextKinds),
    })
    .strict();

export const SuccessPayloadSchema = z
  .object({
    apiVersion: z.string(),
    context: z.string().nullish(),
    id: z.string().nullish(),
    method: z.string().nullish(),
    params: z.record(z.string(), z.string()).nullish(),
    data: DataSchema,
  })
  .strict(); // ensures no `error`

export const ErrorPayloadSchema = z
  .object({
    apiVersion: z.string(),
    context: z.string().nullish(),
    id: z.string().nullish(),
    method: z.string().nullish(),
    params: z.record(z.string(), z.string()).nullish(),
    error: ErrorSchema,
  })
  .strict(); // ensures no `data`

export const ApiPayloadSchema = z.union([SuccessPayloadSchema, ErrorPayloadSchema]);

export const UuidParamsSchema = z.object({ id: z.string().uuid() });
