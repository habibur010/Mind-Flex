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

  // Onboarding
  app.get("/api/onboarding/status", isAuthenticated, async (req: any, res) => {
    const profile = await storage.getUserProfile(req.user.claims.sub);
    res.json({ 
      completed: profile?.onboardingCompleted || false,
      responses: profile?.onboardingResponses || null
    });
  });

  app.post("/api/onboarding/complete", isAuthenticated, async (req: any, res) => {
    try {
      const { responses } = req.body;
      const profile = await storage.saveOnboarding(req.user.claims.sub, responses);
      res.json({ success: true, profile });
    } catch (err) {
      res.status(500).json({ message: "Failed to save onboarding" });
    }
  });

  // n8n chatbot proxy
  app.post("/api/n8n-chat", async (req, res) => {
    try {
      const { chatInput, sessionId } = req.body;
      if (!chatInput) {
        return res.status(400).json({ message: "chatInput is required" });
      }

      const n8nUrl = "https://habibur090.app.n8n.cloud/webhook/e88a87ef-b2e3-4fb8-a6e0-19e48adae0da/chat";
      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatInput, sessionId: sessionId || "mindflex-default" })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ message: errorText || "n8n request failed" });
      }

      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error("n8n proxy error:", err.message);
      res.status(500).json({ message: "Failed to connect to AI service" });
    }
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
