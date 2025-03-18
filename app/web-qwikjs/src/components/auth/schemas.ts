import { z } from '@builder.io/qwik-city';

export const LoginSchema = z.object({
  login: z.string().email(),
  password: z.string(),
});

export const RegisterSchema = z.object({
  login: z.string().email(),
  password: z.string(),
  password_confirmation: z.string(), // Can we inspect that this field matches password?
});
