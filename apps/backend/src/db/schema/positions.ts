import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { companies } from "./companies.js";
import { positionTypeEnum } from "./enums.js";
import { users } from "./users.js";

export const positions = pgTable(
  "positions",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, {
        onDelete: "cascade",
      }),

    title: varchar("title", {
      length: 255,
    }).notNull(),

    location: varchar("location", {
      length: 255,
    }).notNull(),

    type: positionTypeEnum("type")
      .notNull(),

    description: text("description")
      .notNull(),

    salary: varchar("salary", {
      length: 255,
    }).notNull(),

    isActive: boolean("is_active")
      .default(true)
      .notNull(),

    createdBy: uuid("created_by")
      .references(() => users.id, {
        onDelete: "set null",
      }),

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