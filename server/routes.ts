import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { badges } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Setup Chat (text-based)
  registerChatRoutes(app);

  // === APP ROUTES ===
  // Protected routes require authentication
  
  // Tasks
  app.get(api.tasks.list.path, isAuthenticated, async (req: any, res) => {
    const tasks = await storage.getTasks(req.user.claims.sub);
    res.json(tasks);
  });

  app.post(api.tasks.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.tasks.create.input.parse(req.body);
      const task = await storage.createTask(req.user.claims.sub, input);
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.tasks.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.tasks.update.input.parse(req.body);
      const task = await storage.updateTask(id, input);
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.tasks.delete.path, isAuthenticated, async (req: any, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.status(204).send();
  });

  // Mood
  app.get(api.mood.list.path, isAuthenticated, async (req: any, res) => {
    const logs = await storage.getMoodLogs(req.user.claims.sub);
    res.json(logs);
  });

  app.post(api.mood.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.mood.create.input.parse(req.body);
      const log = await storage.createMoodLog(req.user.claims.sub, input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Assessments
  app.get(api.assessments.list.path, isAuthenticated, async (req: any, res) => {
    const assessments = await storage.getAssessments(req.user.claims.sub);
    res.json(assessments);
  });

  app.post(api.assessments.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.assessments.create.input.parse(req.body);
      const assessment = await storage.createAssessment(req.user.claims.sub, input);
      res.status(201).json(assessment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Health
  app.get(api.health.list.path, isAuthenticated, async (req: any, res) => {
    const data = await storage.getHealthData(req.user.claims.sub);
    res.json(data);
  });

  app.post(api.health.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.health.create.input.parse(req.body);
      const data = await storage.createHealthData(req.user.claims.sub, input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Stats & Badges
  app.get(api.user.stats.path, isAuthenticated, async (req: any, res) => {
    const stats = await storage.getUserStats(req.user.claims.sub);
    res.json(stats);
  });

  app.get(api.user.badges.path, isAuthenticated, async (req: any, res) => {
    const userBadges = await storage.getUserBadges(req.user.claims.sub);
    res.json(userBadges);
  });

  // Seed badges if empty
  await seedBadges();

  return httpServer;
}

async function seedBadges() {
  const existing = await db.select().from(badges);
  if (existing.length === 0) {
    await db.insert(badges).values([
      { name: "Early Bird", description: "Complete a morning task before 9 AM", icon: "sun", category: "productivity" },
      { name: "Streak Master", description: "Maintain a 7-day streak", icon: "flame", category: "streak" },
      { name: "Zen Master", description: "Complete 5 meditation sessions", icon: "lotus", category: "wellness" },
    ]);
  }
}
