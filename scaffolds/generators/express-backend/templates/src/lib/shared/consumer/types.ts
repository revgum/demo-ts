import { z } from 'zod';
import { ConsumerStatuses } from './handler';

type ConsumerStatuses = (typeof ConsumerStatuses)[keyof typeof ConsumerStatuses];

export const ConsumerStatusEnum = z.enum(
  Object.values(ConsumerStatuses) as [ConsumerStatuses, ...ConsumerStatuses[]],
);
export type ConsumerStatus = z.infer<typeof ConsumerStatusEnum>;
