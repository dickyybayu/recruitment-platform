import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { applicantStatusEnum } from "./enums.js";
import { positions } from "./positions.js";

export const applicants = pgTable(
  "applicants",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    positionId: uuid("position_id")
      .notNull()
      .references(() => positions.id, {
        onDelete: "cascade",
      }),

    fullName: varchar("full_name", {
      length: 255,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    phone: varchar("phone", {
      length: 50,
    }).notNull(),

    education: varchar("education", {
      length: 255,
    }).notNull(),

    experience: integer("experience")
      .notNull(),

    resumeUrl: varchar("resume_url", {
      length: 1000,
    }).notNull(),

    status: applicantStatusEnum("status")
      .default("APPLIED")
      .notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

);