import * as p from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { sql } from 'drizzle-orm';

// TIMESTAMPS
const timestamps = {
  updatedAt: p.timestamp('updated_at'),
  createdAt: p.timestamp('created_at').defaultNow().notNull(),
  deletedAt: p.timestamp('deleted_at'),
};

// STORIES
export const stories = p.pgTable('stories', {
  id: p
    .uuid('id')
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  userId: p
    .uuid('user_id')
    .notNull()
    .references(() => users.id),
  fullContent: p.text('full_content').notNull(),
  isUnlocked: p.boolean('is_unlocked').notNull().default(false),
  ...timestamps,
});
