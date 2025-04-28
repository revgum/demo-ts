import { z } from 'zod';
import { ConsumerStatuses } from './handler';
import type { DataSchema } from './schemas';

type ConsumerStatuses = (typeof ConsumerStatuses)[keyof typeof ConsumerStatuses];

export const ConsumerStatusEnum = z.enum(
  Object.values(ConsumerStatuses) as [ConsumerStatuses, ...ConsumerStatuses[]],
);
export type ConsumerStatus = z.infer<typeof ConsumerStatusEnum>;
export type CloudEvent = z.infer<typeof DataSchema>;
