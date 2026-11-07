import {
  boolean,
  integer,
  jsonb,
  pgEnum,
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

export type Choice = {
  text: string;
  correct?: boolean;
  weights?: Record<string, number>;
};

export type Outcome = {
  trait: string;
  title: string;
  text: string;
};

export const quizMode = pgEnum('quiz_mode', ['graded', 'scored', 'survey']);

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  mode: quizMode('mode').notNull().default('graded'),
  showCorrect: boolean('show_correct').notNull().default(false),
  outcomes: jsonb('outcomes').$type<Outcome[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
  prompt: text('prompt').notNull(),
  choices: jsonb('choices').$type<Choice[]>().notNull(),
});

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
