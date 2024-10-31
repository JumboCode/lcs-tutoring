import { boolean, integer, pgTable, varchar, bigint, text } from "drizzle-orm/pg-core";

export const tutorTable = pgTable("tutor", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  first_name: varchar({ length: 100 }).notNull(),
  last_name: varchar({ length: 100 }).notNull(),
  pronouns: varchar({ length: 50 }).notNull(),
  major: varchar({ length: 100 }).notNull(),
  year_grad: varchar({ length: 4 }).notNull(),
  phone: bigint().notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  grade_level_pref: integer().array(), // Use array() to match the integer[] type
  disability_pref: boolean(),
  subject_pref: text().array(), // Use array() to match the text[] type
  tutoring_mode: varchar({ length: 50 }).notNull(),
});
