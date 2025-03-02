import { mysqlTable, varchar, text, timestamp } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const messages = mysqlTable('messages', {
  id: varchar('id', { length: 36 }).primaryKey().notNull().default(sql`(UUID())`),
  name: varchar('name', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert; 