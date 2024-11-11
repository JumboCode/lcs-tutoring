import { boolean, integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const tutorTable = pgTable("tutor", {
  id: varchar({ length: 8 }).notNull().primaryKey(),
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
});

export const tuteeTable = pgTable("tutee", {
  id: varchar({ length: 8 }).notNull().primaryKey(),
  first_name: varchar({ length: 100 }).notNull(),
  last_name: varchar({ length: 100 }).notNull(),
  gender: varchar({ length: 50 }).notNull(),
  grade: integer(),
  has_special_needs: boolean(),
  special_needs: varchar({ length: 50 }),
  parent_first_name: varchar({ length: 100 }).notNull(),
  parent_last_name: varchar({ length: 100 }).notNull(),
  parent_phone: varchar({ length: 10 }).notNull(),
  parent_email: varchar({ length: 100 }).notNull(),
  subject: varchar({ length: 50 }).notNull(),
  tutoring_mode: varchar({ length: 50 }).notNull(),
  notes: text(),
});

export const unmatchedTable = pgTable('unmatched', {
  id: varchar({ length: 8 }).notNull(),
});

export const matchedTable = pgTable('matched', {
  id: varchar({ length: 8 }).notNull(),
});

export const approvedMatchedTable = pgTable('approved_matches', {
  tutor_id: varchar({ length: 8 }).notNull(),
  tutee_id: varchar({ length: 8 }).notNull(),
});
