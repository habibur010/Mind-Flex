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

  // Chatbot: tries Gemini, then OpenAI, then built-in responses
  const SYSTEM_PROMPT = "You are a warm, empathetic psychological wellness assistant for MindFlex, a mental health support app. You help users with ADHD management, anxiety, stress, sleep issues, focus problems, and emotional well-being. Provide practical coping strategies, breathing exercises, mindfulness tips, and supportive conversations. Never diagnose or prescribe medication. Keep responses concise (2-3 paragraphs max), warm, and actionable. Use simple language.";

  app.post("/api/n8n-chat", async (req, res) => {
    try {
      const { chatInput } = req.body;
      if (!chatInput) {
        return res.status(400).json({ message: "chatInput is required" });
      }

      // 1. Try Gemini if API key is available (using v1 REST API directly)
      const geminiKey = process.env.GEMINI_API_KEY?.trim();
      if (geminiKey) {
        const geminiModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];
        for (const modelName of geminiModels) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${geminiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: `${SYSTEM_PROMPT}\n\nUser message: ${chatInput}`
                    }]
                  }],
                  generationConfig: { maxOutputTokens: 512 },
                }),
              }
            );
            if (!geminiRes.ok) {
              const errText = await geminiRes.text();
              console.error(`❌ Gemini error (${modelName}) [${geminiRes.status}]:`, errText.substring(0, 300));
              continue;
            }
            const geminiData: any = await geminiRes.json();
            const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              console.log(`✓ Gemini response successful (model: ${modelName})`);
              return res.json({ output: reply });
            }
          } catch (geminiErr: any) {
            console.error(`❌ Gemini fetch error (${modelName}):`, geminiErr.message?.substring(0, 200));
          }
        }
      }

      // 2. Try OpenAI if API key is available
      const openaiKey = (process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY)?.trim();
      if (openaiKey) {
        try {
          const { default: OpenAI } = await import("openai");
          const openai = new OpenAI({
            apiKey: openaiKey,
            baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
          });
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: chatInput }
            ],
            max_tokens: 500,
          });
          const reply = completion.choices[0]?.message?.content || "I'm here to help. Could you tell me more about how you're feeling?";
          console.log("✓ OpenAI response successful");
          return res.json({ output: reply });
        } catch (aiErr: any) {
          console.error("❌ OpenAI error:", aiErr.message);
        }
      }

      // 3. Built-in keyword-based responses (always works, no API needed)
      console.log("Using built-in responses");
      const builtInResponse = getBuiltInResponse(chatInput);
      return res.json({ output: builtInResponse });
    } catch (err: any) {
      console.error("Chat error:", err.message);
      return res.json({ output: getBuiltInResponse(req.body?.chatInput || "") });
    }
  });

  // Seed badges if empty
  await seedBadges();

  return httpServer;
}

function getBuiltInResponse(input: string): string {
  const lower = input.toLowerCase();
  
  const responses: { keywords: string[]; reply: string }[] = [
    {
      keywords: ["anxious", "anxiety", "worried", "panic", "nervous"],
      reply: "I hear you — anxiety can feel overwhelming, but there are things that can help right now.\n\n**Try this 4-7-8 breathing technique:**\n1. Breathe in through your nose for 4 seconds\n2. Hold your breath for 7 seconds\n3. Exhale slowly through your mouth for 8 seconds\n4. Repeat 3-4 times\n\nAnxiety often comes from worrying about the future. Try to bring yourself back to this moment — what can you see, hear, and feel right now? You're doing great by reaching out."
    },
    {
      keywords: ["stress", "stressed", "overwhelm", "pressure", "burnout"],
      reply: "Stress is your body's way of telling you it needs a break. Here are some practical steps:\n\n**Immediate relief:**\n- Take 5 slow, deep breaths\n- Roll your shoulders and stretch your neck\n- Step away from your screen for 2 minutes\n\n**Longer-term:**\n- Break your tasks into smaller, manageable pieces\n- Prioritize just 1-3 things today — it's okay to let the rest wait\n- Make sure you're drinking enough water\n\nRemember: You don't have to do everything at once. One step at a time."
    },
    {
      keywords: ["sad", "depressed", "down", "unhappy", "low", "cry"],
      reply: "I'm sorry you're feeling this way. Your feelings are valid, and it's okay to not be okay sometimes.\n\n**Some things that might help:**\n- Talk to someone you trust about how you're feeling\n- Go for a short walk, even just 5 minutes outside\n- Put on music that makes you feel something positive\n- Write down 3 things, however small, that you're grateful for today\n\nIf these feelings persist, please consider reaching out to a mental health professional. Check our Doctor Consultation page for specialists who can help. You matter, and you deserve support."
    },
    {
      keywords: ["sleep", "insomnia", "tired", "fatigue", "exhausted", "rest"],
      reply: "Sleep struggles are really common, especially with ADHD. Here are some evidence-based tips:\n\n**Evening routine:**\n- Dim lights 1 hour before bed\n- Put away screens 30 minutes before sleep\n- Try a warm shower or bath\n- Use our breathing exercises to wind down\n\n**Sleep environment:**\n- Keep your room cool (65-68°F / 18-20°C)\n- Use white noise or calming sounds\n- Make your bedroom for sleep only — not work\n\nIf you're exhausted right now, it's okay to take a 20-minute power nap. Set an alarm so you don't oversleep!"
    },
    {
      keywords: ["focus", "concentrate", "distract", "attention", "adhd", "scattered"],
      reply: "Staying focused can be tough, especially with ADHD. Here are some strategies that work:\n\n**The Pomodoro Technique:**\n1. Set a timer for 25 minutes\n2. Focus on ONE task only\n3. Take a 5-minute break\n4. Repeat — after 4 rounds, take a longer break\n\n**Environment tips:**\n- Remove distractions (put phone face-down)\n- Use noise-canceling headphones or lo-fi music\n- Keep only what you need on your desk\n\n**Quick focus boost:**\n- Drink a glass of cold water\n- Do 10 jumping jacks\n- Try one of our brain games to warm up your focus!\n\nYou've got this."
    },
    {
      keywords: ["angry", "frustrated", "mad", "irritated", "rage"],
      reply: "Feeling angry or frustrated is completely normal. The key is finding healthy ways to express it.\n\n**Right now, try this:**\n- Clench your fists tight for 5 seconds, then release — feel the tension leave\n- Take 3 deep breaths, exhaling longer than you inhale\n- Count backwards from 10 slowly\n\n**After you've calmed down:**\n- Write down what triggered the anger\n- Ask yourself: Will this matter in a week? A month?\n- Consider talking it through — sometimes just being heard helps\n\nIt's okay to feel angry. What matters is how we respond to it."
    },
    {
      keywords: ["lonely", "alone", "isolated", "no friends"],
      reply: "Feeling lonely can be really painful, and I want you to know that reaching out here already shows courage.\n\n**Some ideas:**\n- Join an online community related to something you enjoy\n- Volunteer — helping others often helps us feel connected\n- Reach out to someone you haven't talked to in a while, even a simple \"hey, how are you?\" text\n- Consider joining a support group (check our Doctor Consultation page)\n\nRemember: being alone and being lonely are different things. It's okay to enjoy your own company too. But if loneliness is persistent, talking to a therapist can really help."
    },
    {
      keywords: ["hello", "hi", "hey", "good morning", "good evening"],
      reply: "Hello! Welcome to MindFlex. I'm here to support your mental wellness journey.\n\nYou can talk to me about:\n- Managing stress or anxiety\n- Improving focus and attention\n- Sleep difficulties\n- Coping with difficult emotions\n- ADHD management strategies\n- Or anything else on your mind\n\nHow are you feeling today? I'm here to listen and help."
    },
    {
      keywords: ["thank", "thanks", "helpful", "appreciate"],
      reply: "You're welcome! I'm glad I could help. Remember, taking care of your mental health is one of the most important things you can do for yourself.\n\nFeel free to come back anytime you need support, want to try a breathing exercise, or just need someone to talk to. You're doing great by prioritizing your well-being!"
    }
  ];

  for (const r of responses) {
    if (r.keywords.some(kw => lower.includes(kw))) {
      return r.reply;
    }
  }

  return "Thank you for sharing that with me. Your feelings are important and valid.\n\nHere are some things that might help right now:\n- **Breathe:** Try taking 5 slow, deep breaths\n- **Move:** A short walk or gentle stretch can shift your mood\n- **Connect:** Talk to someone you trust about how you're feeling\n- **Play:** Try one of our brain games for a quick mental reset\n\nI'm here whenever you need support. Is there anything specific you'd like help with — like managing stress, improving focus, or getting better sleep?";
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
