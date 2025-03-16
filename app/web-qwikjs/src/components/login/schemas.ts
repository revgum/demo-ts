import { z } from '@builder.io/qwik-city';

export const LoginSchema = z.object({
  login: z.string().email(),
  password: z.string(),
});
