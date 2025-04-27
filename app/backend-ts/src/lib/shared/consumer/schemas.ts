import { z, type ZodTypeAny } from 'zod';

export const createDataSchema = <T extends ZodTypeAny>(itemSchema: T) =>
  DataSchema.merge(z.object({ data: itemSchema }).passthrough());

const DataSchema = z.object({
  id: z.string(),
  datacontenttype: z.string(),
  pubsubname: z.string(),
  source: z.string(),
  time: z.string().datetime(),
  topic: z.string(),
  traceid: z.string(),
  traceparent: z.string(),
  tracestate: z.string().nullish(),
  specversion: z.string(),
  type: z.string(),
});
