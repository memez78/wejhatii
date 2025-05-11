import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("fullName").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Travel preferences
export const travelPreferences = pgTable("travel_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  budget: integer("budget").notNull(),
  startDate: text("start_date"),
  endDate: text("end_date"),
  interests: text("interests").array(),
  companions: text("companions").notNull(),
  muslimRequirements: text("muslim_requirements").array(),
  revealPreference: text("reveal_preference").notNull(),
  revealTiming: text("reveal_timing"),
  destinationId: text("destination_id"),
  revealed: boolean("revealed").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const TravelPreferencesSchema = z.object({
  budget: z.number().min(200).max(10000),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  interests: z.array(z.string()).optional(),
  companions: z.string(),
  muslimRequirements: z.array(z.string()).optional(),
  revealPreference: z.enum(["now", "later"]),
  revealTiming: z.string().optional(),
});

export const insertTravelPreferencesSchema = createInsertSchema(travelPreferences).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TravelPreferences = typeof travelPreferences.$inferSelect;
export type InsertTravelPreferences = z.infer<typeof insertTravelPreferencesSchema>;
