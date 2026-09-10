import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/database/drizzle',
  schema: './src/database/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.PG_DATABASE!,
  },
});
