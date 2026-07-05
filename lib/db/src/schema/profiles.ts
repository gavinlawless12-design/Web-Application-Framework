import { pgTable, serial, text, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const investorProfilesTable = pgTable("investor_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  goal: text("goal").notNull(),
  horizon: text("horizon").notNull(),
  riskTolerance: text("risk_tolerance").notNull(),
  dividendPreference: text("dividend_preference").notNull(),
  internationalExposure: boolean("international_exposure").notNull().default(false),
  smallCapPreference: boolean("small_cap_preference").notNull().default(false),
  sectors: json("sectors").$type<string[]>().notNull().default([]),
  esgPreference: boolean("esg_preference").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertInvestorProfileSchema = createInsertSchema(investorProfilesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInvestorProfile = z.infer<typeof insertInvestorProfileSchema>;
export type InvestorProfile = typeof investorProfilesTable.$inferSelect;
