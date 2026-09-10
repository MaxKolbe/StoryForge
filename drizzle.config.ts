import { defineConfig } from 'drizzle-kit';
import { env } from "./src/config/env.validation.js"

export default defineConfig({
  out: './src/database/drizzle',
  schema: './src/database/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.PG_DATABASE!,
  },
});
