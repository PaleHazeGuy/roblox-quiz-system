import {
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  robloxUserId: text('roblox_user_id').notNull().unique(),
  username: text('username').notNull(),
  displayName: text('display_name'),
  accountAgeDays: integer('account_age_days'),
  region: text('region'),
  policyFlags: jsonb('policy_flags').$type<Record<string, unknown>>(),
  firstSeen: timestamp('first_seen', { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastSeen: timestamp('last_seen', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
