import { boolean, integer, pgTable, varchar, text, date, serial } from "drizzle-orm/pg-core";

export const tutorTable = pgTable("tutor", {
  id: varchar({ length: 7 }).notNull().primaryKey(),
  first_name: varchar({ length: 100 }).notNull(),
  last_name: varchar({ length: 100 }).notNull(),
  pronouns: varchar({ length: 50 }).notNull(),
  major: varchar({ length: 100 }).notNull(),
  year_grad: varchar({ length: 4 }).notNull(),
  phone: varchar({ length: 10 }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  grade_level_pref: integer().array(),
  disability_pref: boolean(),
  subject_pref: varchar({ length: 50 }).array(),
  tutoring_mode: varchar({ length: 50 }).notNull(),
  date: date().notNull(),
  previous_tutee: boolean('previous_tutee').default(false).notNull(),
  continuing_tutee_name: varchar({ length: 50 }),
  num_tutees: integer().default(0).notNull(),
  notes: text(),
  language_proficiencies: varchar({ length: 100 }),
});

export const tuteeTable = pgTable("tutee", {
  id: serial('id').primaryKey(),
  tutee_first_name: varchar({ length: 100 }).notNull(),
  tutee_last_name: varchar({ length: 100 }).notNull(),
  gender: varchar({ length: 50 }).notNull(),
  grade: integer(),
  has_special_needs: boolean(),
  special_needs: varchar({ length: 50 }),
  parent_first_name: varchar({ length: 100 }).notNull(),
  parent_last_name: varchar({ length: 100 }).notNull(),
  parent_phone: varchar({ length: 10 }).notNull(),
  parent_email: varchar({ length: 100 }).notNull(),
  subjects: varchar({ length: 50 }).array(),
  tutoring_mode: varchar({ length: 50 }).notNull(),
  notes: text(),
  date: date().notNull(),
});

export const unmatchedTable = pgTable('unmatched', {
  id: serial('id').primaryKey(),
  tutee_id: integer().references(() => tuteeTable.id),
  tutor_id: varchar({ length: 7 }).references(() => tutorTable.id),
  flagged: boolean('flagged').notNull().default(false),
});

export const matchedTable = pgTable('matched', {
  id: serial('id').primaryKey(),
  tutee_id: integer().references(() => tuteeTable.id),
  tutor_id: varchar({ length: 7 }).references(() => tutorTable.id),
});

export const historyTable = pgTable('history', {
  id: serial('id').primaryKey(),
  tutee_id: integer().references(() => tuteeTable.id),
  tutor_id: varchar({ length: 7 }).references(() => tutorTable.id),
});

export const approvedMatchesTable = pgTable('approved_matches', {
  id: serial('id').primaryKey(),
  tutee_id: integer().notNull().references(() => tuteeTable.id),
  tutor_id: varchar({ length: 7 }).notNull().references(() => tutorTable.id),
  flagged: boolean('flagged').notNull().default(false),
});

export const adminTable = pgTable("admin", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
});