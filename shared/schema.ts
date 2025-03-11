import { pgTable, text, serial, integer, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const travelPreferences = pgTable("travel_preferences", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  interests: text("interests").array().notNull(),
  activityLevel: text("activity_level").notNull(),
  diningPreferences: text("dining_preferences").array().notNull(),
  restaurantBudget: integer("restaurant_budget").notNull(),
  additionalNotes: text("additional_notes"),
  bookletContent: jsonb("booklet_content").notNull(),
});

export const insertTravelPreferencesSchema = createInsertSchema(travelPreferences)
  .omit({ id: true, bookletContent: true })
  .extend({
    interests: z.array(z.string()).min(1, "Select at least one interest"),
    diningPreferences: z.array(z.string()).min(1, "Select at least one dining preference"),
    startDate: z.coerce.date().min(new Date(), "Start date must be in the future"),
    endDate: z.coerce.date(),
    restaurantBudget: z.number().min(1).max(3),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type TravelPreferences = typeof travelPreferences.$inferSelect;
export type InsertTravelPreferences = z.infer<typeof insertTravelPreferencesSchema>;

export type BookletContent = {
  title: string;
  summary: string;
  sections: {
    title: string;
    content: string;
  }[];
};