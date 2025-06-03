import { z } from 'zod';
import { ConsumerStatuses, type DataSchema } from '../consumer';

type ConsumerStatuses = (typeof ConsumerStatuses)[keyof typeof ConsumerStatuses];

export const ConsumerStatusEnum = z.enum(
  Object.values(ConsumerStatuses) as [ConsumerStatuses, ...ConsumerStatuses[]],
);
export type ConsumerStatus = z.infer<typeof ConsumerStatusEnum>;
export type CloudEvent = z.infer<typeof DataSchema>;
