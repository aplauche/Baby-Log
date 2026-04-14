import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const entries = sqliteTable("entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),

  // Date and time of the feeding/event
  entryDate: text("entry_date").notNull(),
  entryTime: text("entry_time").notNull(),

  // Food type: "breast", "bottle", or null (no feeding logged)
  foodType: text("food_type"),

  // Bottle fields
  bottleAmountMl: real("bottle_amount_ml"),

  // Breast fields
  breastSide: text("breast_side"), // "left", "right", "both"
  breastDurationMin: integer("breast_duration_min"),

  // Diaper
  pee: integer("pee", { mode: "boolean" }).notNull().default(false),
  poop: integer("poop", { mode: "boolean" }).notNull().default(false),

  // Additional comments
  comments: text("comments"),
});

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
