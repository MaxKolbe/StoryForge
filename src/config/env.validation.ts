import { HttpException } from '@nestjs/common';
import * as z from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.string().default('3000'),
  PG_DATABASE: z
    .string()
    .default('postgresql://user:password@localhost:5432/database'),
  LOG_LEVEL: z.string().default('http'),
  JWT_SECRET: z.string().default('thequickbrownfoxjumpedoverthelog'),
  BREVO_API_KEY: z.string('BREVO_API_KEY is missing'),
  BREVO_EMAIL: z.string('BREVO_EMAIL is missing'),
  STRIPE_SECRET_KEY: z.string('STRIPE_SECRET_KEY is missing'),
  STRIPE_WEBHOOK_SECRET: z.string('STRIPE_WEBHOOK_SECRET is missing'),
  API_BASE_URL: z.string().default('http://localhost:3000'),
});

const result = EnvSchema.safeParse(process.env);
if (!result.success) {
  const errors = result.error.issues.map((issue: any) => ({
    field: issue.path,
    message: issue.message,
  }));

  const error = new Error('Invalid environment configuration');

  (error as Error & { metadata?: unknown }).metadata = errors;

  throw error;

}

export const env = result.data;
