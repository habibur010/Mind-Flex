import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
export * from "./models/auth";
export * from "./models/chat";

// === TABLE DEFINITIONS ===

// Tasks table for daily structure
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // From auth system
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  category: text("category").notNull(), // morning, afternoon, evening
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mood logs
export const moodLogs = pgTable("mood_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  value: integer("value").notNull(), // 1-5
  note: text("note"),
  tags: jsonb("tags").$type<string[]>(), // ["anxious", "calm", etc]
  createdAt: timestamp("created_at").defaultNow(),
});

// Assessments (Webcam or Questionnaire)
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // "webcam" or "questionnaire"
  data: jsonb("data").notNull(), // Store raw responses/analysis
  result: text("result"), // Summary result
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Data (Smartwatch imports)
export const healthData = pgTable("health_data", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  source: text("source").notNull(), // "apple_health", "fitbit", "manual"
  metrics: jsonb("metrics").notNull(), // { steps: 5000, sleep_hours: 7 }
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // icon name or url
  category: text("category").notNull(), // "streak", "completion", "wellness"
});

// User Badges (Many-to-Many)
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  badgeId: integer("badge_id").notNull(), // No FK constraint for simplicity in prototype
  earnedAt: timestamp("earned_at").defaultNow(),
});

// User profile extension
export const userProfile = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences").$type<{
    theme: string;
    notifications: boolean;
  }>(),
});

// === SCHEMAS ===
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true, createdAt: true });
export const insertMoodLogSchema = createInsertSchema(moodLogs).omit({ id: true, createdAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true });
export const insertHealthDataSchema = createInsertSchema(healthData).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfile).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTaskRequest = Partial<InsertTask>;

export type MoodLog = typeof moodLogs.$inferSelect;
export type InsertMoodLog = z.infer<typeof insertMoodLogSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type HealthData = typeof healthData.$inferSelect;
export type InsertHealthData = z.infer<typeof insertHealthDataSchema>;

export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;

export type UserProfile = typeof userProfile.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export interface UserStats {
  points: number;
  currentStreak: number;
  tasksCompleted: number;
}
