import type {
  ApiPayloadSchema,
  ErrorPayloadSchema,
  SuccessPayloadSchema,
} from '@/lib/shared/api/schemas';
import type { z } from 'zod';

export type ApiPayload = z.infer<typeof ApiPayloadSchema>;
export type ApiDataPayload = z.infer<typeof SuccessPayloadSchema>;
export type ApiErrorPayload = z.infer<typeof ErrorPayloadSchema>;
