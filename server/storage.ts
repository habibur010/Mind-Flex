import { 
  users, tasks, moodLogs, assessments, healthData, badges, userBadges, userProfile,
  type User, type InsertTask, type Task, type UpdateTaskRequest,
  type InsertMoodLog, type MoodLog,
  type InsertAssessment, type Assessment,
  type InsertHealthData, type HealthData,
  type Badge, type UserBadge, type UserProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  createTask(userId: string, task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: UpdateTaskRequest): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Mood
  getMoodLogs(userId: string): Promise<MoodLog[]>;
  createMoodLog(userId: string, log: InsertMoodLog): Promise<MoodLog>;

  // Assessments
  getAssessments(userId: string): Promise<Assessment[]>;
  createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment>;

  // Health
  getHealthData(userId: string): Promise<HealthData[]>;
  createHealthData(userId: string, data: InsertHealthData): Promise<HealthData>;

  // User/Badges
  getUserBadges(userId: string): Promise<Badge[]>;
  getUserStats(userId: string): Promise<{ points: number, streak: number, tasksCompleted: number }>;

  // Onboarding
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveOnboarding(userId: string, responses: any): Promise<UserProfile>;
}

export class DatabaseStorage implements IStorage {
  // Tasks
  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId)).orderBy(desc(tasks.createdAt));
  }

  async createTask(userId: string, task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values({ ...task, userId }).returning();
    return newTask;
  }

  async updateTask(id: number, updates: UpdateTaskRequest): Promise<Task> {
    const [updated] = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Mood
  async getMoodLogs(userId: string): Promise<MoodLog[]> {
    return await db.select().from(moodLogs).where(eq(moodLogs.userId, userId)).orderBy(desc(moodLogs.createdAt));
  }

  async createMoodLog(userId: string, log: InsertMoodLog): Promise<MoodLog> {
    const [newLog] = await db.insert(moodLogs).values({ ...log, userId }).returning();
    return newLog;
  }

  // Assessments
  async getAssessments(userId: string): Promise<Assessment[]> {
    return await db.select().from(assessments).where(eq(assessments.userId, userId)).orderBy(desc(assessments.createdAt));
  }

  async createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values({ ...assessment, userId }).returning();
    return newAssessment;
  }

  // Health
  async getHealthData(userId: string): Promise<HealthData[]> {
    return await db.select().from(healthData).where(eq(healthData.userId, userId)).orderBy(desc(healthData.date));
  }

  async createHealthData(userId: string, data: InsertHealthData): Promise<HealthData> {
    const [newData] = await db.insert(healthData).values({ ...data, userId }).returning();
    return newData;
  }

  // Stats
  async getUserBadges(userId: string): Promise<Badge[]> {
    // Join badges and userBadges
    const result = await db.select({
      id: badges.id,
      name: badges.name,
      description: badges.description,
      icon: badges.icon,
      category: badges.category
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId));
    
    return result;
  }

  async getUserStats(userId: string): Promise<{ points: number, streak: number, tasksCompleted: number }> {
    const completedTasks = await db.select().from(tasks).where(and(eq(tasks.userId, userId), eq(tasks.completed, true)));
    const points = completedTasks.length * 10;
    const streak = 3; 
    return { points, streak, tasksCompleted: completedTasks.length };
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const [profile] = await db.select().from(userProfile).where(eq(userProfile.userId, userId));
    return profile || null;
  }

  async saveOnboarding(userId: string, responses: any): Promise<UserProfile> {
    const existing = await this.getUserProfile(userId);
    if (existing) {
      const [updated] = await db.update(userProfile)
        .set({ onboardingCompleted: true, onboardingResponses: responses })
        .where(eq(userProfile.userId, userId))
        .returning();
      return updated;
    } else {
      const [newProfile] = await db.insert(userProfile)
        .values({ userId, onboardingCompleted: true, onboardingResponses: responses })
        .returning();
      return newProfile;
    }
  }
}

export const storage = new DatabaseStorage();
