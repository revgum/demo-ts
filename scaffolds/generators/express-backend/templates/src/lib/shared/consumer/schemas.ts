import { z, type ZodTypeAny } from 'zod';

export const createDataSchema = <T extends ZodTypeAny>(itemSchema: T) =>
  DataSchema.merge(z.object({ data: itemSchema }).passthrough());

export const DataSchema = z.object({
  id: z.string(),
  datacontenttype: z.string().nullish(),
  pubsubname: z.string().nullish(),
  source: z.string().nullish(),
  time: z.string().datetime().nullish(),
  topic: z.string().nullish(),
  traceid: z.string().nullish(),
  traceparent: z.string().nullish(),
  tracestate: z.string().nullish().nullish(),
  specversion: z.string().nullish(),
  type: z.string().nullish(),
});
