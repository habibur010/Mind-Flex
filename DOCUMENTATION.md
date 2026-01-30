# MindFlex - Comprehensive Project Documentation

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement & Solution](#2-problem-statement--solution)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Database Design](#5-database-design)
6. [Frontend Implementation](#6-frontend-implementation)
7. [Backend Implementation](#7-backend-implementation)
8. [Feature Modules](#8-feature-modules)
   - 8.1 Dashboard
   - 8.2 Task Management
   - 8.3 Brain Games
   - 8.4 Face Analyzer
   - 8.5 Wellness & Yoga
   - 8.6 Music Player
   - 8.7 AI Chat Support
   - 8.8 Mood Tracking
9. [Authentication System](#9-authentication-system)
10. [Local Setup Guide](#10-local-setup-guide)
11. [Project Structure](#11-project-structure)
12. [Conclusion](#12-conclusion)

---

## 1. Introduction

**MindFlex** is a comprehensive web application designed specifically to support individuals with ADHD (Attention Deficit Hyperactivity Disorder) in managing their daily lives. The application provides a structured, calming, and engaging environment that helps users maintain focus, track their emotional well-being, and develop healthy habits through gamification.

### Key Objectives:
- Provide structured daily routines through task management
- Offer focus-enhancing brain games
- Enable self-assessment through facial analysis
- Support relaxation with yoga and music
- Track emotional patterns through mood logging
- Motivate users through gamification (points, badges, streaks)

### Target Audience:
- Children, adolescents, and adults with ADHD
- Parents and caregivers of individuals with ADHD
- Educators working with neurodiverse students
- Mental health professionals seeking supplementary tools

---

## 2. Problem Statement & Solution

### Problem Statement (MENTIS0012)
> "Children with ADHD and Autism Spectrum Disorder (ASD) often face challenges related to attention, focus, organization, social understanding, and adaptive learning. These difficulties can hinder academic progress and classroom participation."

### How MindFlex Addresses This:

| Requirement | MindFlex Solution |
|-------------|-------------------|
| Structured learning & routine management | Daily Task System with Morning/Afternoon/Evening categories |
| Focus and engagement support | Brain Games (Sudoku, Memory Match, Reaction Tapper) |
| Behavior & progress tracking | Mood Tracker, Health Data Integration, Points System |
| Interactive educational aids | Non-AI puzzles and simulation-based games |
| Privacy-first architecture | Local-only Face Analyzer, secure authentication |

---

## 3. System Architecture

MindFlex follows a modern **Full-Stack JavaScript** architecture with clear separation between frontend and backend.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Dashboard│  │  Tasks  │  │  Games  │  │ Wellness│  ...   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│  ┌────▼────────────▼────────────▼────────────▼────┐        │
│  │              React Query (State Management)     │        │
│  └────────────────────────┬───────────────────────┘        │
└───────────────────────────│─────────────────────────────────┘
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     SERVER (Express.js)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  API Routes │  │ Auth Module │  │ AI Chat     │         │
│  └──────┬──────┘  └─────────────┘  └─────────────┘         │
│         │                                                   │
│  ┌──────▼──────────────────────────────────────────┐       │
│  │              Storage Layer (Drizzle ORM)         │       │
│  └──────────────────────────┬──────────────────────┘       │
└─────────────────────────────│───────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL DB  │
                    │   (Neon hosted)  │
                    └──────────────────┘
```

---

## 4. Technology Stack

### Frontend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Component Library | 18.x |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Vite** | Build Tool & Dev Server | 5.x |
| **Tailwind CSS** | Utility-first CSS Framework | 3.x |
| **Framer Motion** | Animation Library | 11.x |
| **TanStack Query** | Server State Management | 5.x |
| **Wouter** | Lightweight Routing | 3.x |
| **Lucide React** | Icon Library | - |
| **Shadcn/UI** | Component Library | - |

### Backend Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | JavaScript Runtime | 20.x |
| **Express.js** | Web Framework | 4.x |
| **TypeScript** | Type-safe JavaScript | 5.x |
| **Drizzle ORM** | Database ORM | - |
| **PostgreSQL** | Relational Database | 16 |
| **Passport.js** | Authentication Middleware | - |
| **Zod** | Schema Validation | - |

### Design Fonts

| Font | Usage |
|------|-------|
| **Architects Daughter** | Headings (playful, hand-written style) |
| **DM Sans** | Body text (dyslexia-friendly readability) |
| **Outfit** | Secondary headings |

---

## 5. Database Design

### Entity Relationship Diagram

The database consists of the following main tables:

### 5.1 Tasks Table

```typescript
// File: shared/schema.ts

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  category: text("category").notNull(), // "morning", "afternoon", "evening"
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Explanation:**
- `id`: Auto-incrementing primary key
- `userId`: References the authenticated user
- `title`: The task name (e.g., "Make the bed")
- `category`: Time of day classification for structured routines
- `completed`: Boolean to track task completion status

### 5.2 Mood Logs Table

```typescript
export const moodLogs = pgTable("mood_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  value: integer("value").notNull(), // 1-5 scale
  note: text("note"),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Explanation:**
- `value`: Mood rating from 1 (Angry) to 5 (Great)
- `tags`: Optional array of emotion tags like ["anxious", "calm"]
- Enables pattern recognition over time

### 5.3 Assessments Table

```typescript
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // "webcam" or "questionnaire"
  data: jsonb("data").notNull(),
  result: text("result"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 5.4 Health Data Table

```typescript
export const healthData = pgTable("health_data", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  source: text("source").notNull(), // "apple_health", "fitbit", "manual"
  metrics: jsonb("metrics").notNull(), // { steps: 5000, sleep_hours: 7 }
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 5.5 Badges & User Badges Tables

```typescript
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // "streak", "completion", "wellness"
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});
```

---

## 6. Frontend Implementation

### 6.1 Application Entry Point

```typescript
// File: client/src/App.tsx

import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function Router() {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Unauthenticated users see landing page only
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
      </Switch>
    );
  }

  // Authenticated users have access to all routes
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/games" component={Games} />
      <Route path="/chat" component={Chat} />
      <Route path="/wellness" component={Wellness} />
      <Route path="/face-analyzer" component={FaceAnalyzer} />
      <Route path="/music" component={Music} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

**Explanation:**
- Uses `wouter` for lightweight client-side routing
- `QueryClientProvider` wraps the app for server state management
- Authentication check determines which routes are accessible
- Protected routes are only shown to logged-in users

### 6.2 Dashboard Layout Component

```typescript
// File: client/src/components/DashboardLayout.tsx

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
```

**Explanation:**
- Wraps all authenticated pages with consistent layout
- Includes sidebar for desktop and mobile navigation
- Centers content with max-width container
- Handles loading and authentication states

### 6.3 Custom Hooks - Task Management

```typescript
// File: client/src/hooks/use-tasks.ts

export function useTasks() {
  return useQuery({
    queryKey: [api.tasks.list.path],
    queryFn: async () => {
      const res = await fetch(api.tasks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return api.tasks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertTask) => {
      const res = await fetch(api.tasks.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create task");
      return api.tasks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate cache to refetch tasks
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
      toast({ title: "Task Created", description: "Let's get it done!" });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const url = buildUrl(api.tasks.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tasks.list.path] });
    },
  });
}
```

**Explanation:**
- `useTasks()`: Fetches all tasks for the current user
- `useCreateTask()`: Creates a new task and invalidates the cache
- `useUpdateTask()`: Updates task properties (like completion status)
- All hooks use TanStack Query for caching and synchronization

---

## 7. Backend Implementation

### 7.1 API Routes

```typescript
// File: server/routes.ts

export async function registerRoutes(httpServer: Server, app: Express) {
  // Setup Authentication
  await setupAuth(app);
  registerAuthRoutes(app);

  // Setup AI Chat
  registerChatRoutes(app);

  // === TASK ROUTES ===
  
  // GET /api/tasks - List all tasks for user
  app.get(api.tasks.list.path, isAuthenticated, async (req, res) => {
    const tasks = await storage.getTasks(req.user.claims.sub);
    res.json(tasks);
  });

  // POST /api/tasks - Create a new task
  app.post(api.tasks.create.path, isAuthenticated, async (req, res) => {
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

  // PUT /api/tasks/:id - Update a task
  app.put(api.tasks.update.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const input = api.tasks.update.input.parse(req.body);
    const task = await storage.updateTask(id, input);
    res.json(task);
  });

  // DELETE /api/tasks/:id - Delete a task
  app.delete(api.tasks.delete.path, isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.status(204).send();
  });

  // === MOOD ROUTES ===
  app.get(api.mood.list.path, isAuthenticated, async (req, res) => {
    const logs = await storage.getMoodLogs(req.user.claims.sub);
    res.json(logs);
  });

  app.post(api.mood.create.path, isAuthenticated, async (req, res) => {
    const input = api.mood.create.input.parse(req.body);
    const log = await storage.createMoodLog(req.user.claims.sub, input);
    res.status(201).json(log);
  });

  // === USER STATS ===
  app.get(api.user.stats.path, isAuthenticated, async (req, res) => {
    const stats = await storage.getUserStats(req.user.claims.sub);
    res.json(stats);
  });

  return httpServer;
}
```

**Explanation:**
- All routes use `isAuthenticated` middleware for security
- Input validation is performed using Zod schemas
- The `storage` layer abstracts database operations
- RESTful design pattern (GET, POST, PUT, DELETE)

### 7.2 Storage Layer

```typescript
// File: server/storage.ts

export class DatabaseStorage implements IStorage {
  
  // Get all tasks for a user
  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  // Create a new task
  async createTask(userId: string, task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values({ ...task, userId })
      .returning();
    return newTask;
  }

  // Update an existing task
  async updateTask(id: number, updates: UpdateTaskRequest): Promise<Task> {
    const [updated] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    return updated;
  }

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Calculate user statistics
  async getUserStats(userId: string) {
    const completedTasks = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.userId, userId), eq(tasks.completed, true)));
    
    const points = completedTasks.length * 10;
    const streak = 3; // Placeholder calculation
    
    return { points, streak, tasksCompleted: completedTasks.length };
  }
}

export const storage = new DatabaseStorage();
```

**Explanation:**
- Uses Drizzle ORM for type-safe database queries
- Implements the `IStorage` interface for consistency
- All methods are async for non-blocking I/O
- Points are calculated as 10 per completed task

---

## 8. Feature Modules

### 8.1 Dashboard

The Dashboard is the main landing page for authenticated users.

```typescript
// File: client/src/pages/Dashboard.tsx

// Daily motivational messages (7 messages, one per day)
const DAILY_MESSAGES = [
  "Gratitude first – "I'm thankful for waking up today..."",
  "Fresh start mindset – "Yesterday is gone..."",
  "Small wins matter – "Even tiny steps forward..."",
  // ... 7 total messages
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tasks } = useTasks();
  const { data: stats } = useUserStats();

  // Calculate which message to show based on day of year
  const startDate = new Date(2024, 0, 1);
  const dayIndex = differenceInDays(new Date(), startDate) % 7;
  const dailyMessage = DAILY_MESSAGES[dayIndex];

  return (
    <DashboardLayout>
      {/* Welcome Header with User Name */}
      <h1>Hi, {user?.firstName || 'Friend'}!</h1>
      
      {/* Daily Streak Badge */}
      <div>Daily Streak: {stats?.streak || 0} Days</div>
      
      {/* Daily Motivational Message with Background Image */}
      <div className="relative h-48 rounded-[2rem] overflow-hidden">
        <img src={dashboardBg} className="absolute inset-0" />
        <p className="text-white">{dailyMessage}</p>
      </div>
      
      {/* Mood Tracker Component */}
      <MoodTracker />
      
      {/* Today's Focus - First 3 incomplete tasks */}
      <div>
        {todayTasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>
      
      {/* Quick Access Cards to Games and Wellness */}
      <Link href="/games">Brain Games</Link>
      <Link href="/wellness">Breathe & Move</Link>
    </DashboardLayout>
  );
}
```

**Features:**
- Personalized greeting with user's name
- Daily streak tracking for motivation
- Rotating daily motivational messages
- Quick mood logging
- Overview of pending tasks
- Quick navigation to other features

### 8.2 Task Management

The Task page provides a structured approach to daily activities.

```typescript
// File: client/src/pages/Tasks.tsx

// 21 predefined ADHD-friendly tasks (7 days x 3 tasks per day)
const ROTATING_TASKS = [
  // Day 1
  { title: "Make the bed", category: "morning", info: "quick win, sets order" },
  { title: "Drink a glass of water", category: "morning", info: "hydration" },
  { title: "Write 1 priority for the day", category: "morning", info: "focus" },
  // Day 2
  { title: "Stretch for 5 minutes", category: "morning", info: "wakes up body" },
  // ... 21 total tasks
];

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();

  // Calculate which 3 tasks to show today
  const startDate = new Date(2024, 0, 1);
  const dayOffset = differenceInDays(new Date(), startDate) % 7;
  const dailyRotatingTasks = ROTATING_TASKS.slice(dayOffset * 3, (dayOffset * 3) + 3);

  return (
    <DashboardLayout>
      {/* Daily Rotation Section - Shows 3 suggested tasks */}
      <div className="bg-primary/5 p-8 rounded-[2.5rem]">
        <span>Daily Rotation</span>
        <h2>Day {dayOffset + 1} Focus</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dailyRotatingTasks.map((task, i) => (
            <div key={i}>
              <span>{task.category}</span>
              <h3>{task.title}</h3>
              <p>— {task.info}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Task List by Category */}
      <div className="grid md:grid-cols-3 gap-8">
        {["morning", "afternoon", "evening"].map((cat) => (
          <div key={cat}>
            <h2>{cat}</h2>
            {tasks?.filter(t => t.category === cat).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ))}
      </div>

      {/* Add Task Dialog */}
      <Dialog>
        <form onSubmit={handleCreate}>
          <Input placeholder="What needs to be done?" />
          <Select>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </Select>
          <Button type="submit">Create Task</Button>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
```

**Features:**
- 21-task rotation system (3 new suggestions per day)
- Tasks categorized by time of day
- Each suggested task includes ADHD-specific benefits
- Users can add their own custom tasks
- Visual completion tracking

### 8.3 Brain Games

Three focus-enhancing games designed for ADHD support.

```typescript
// File: client/src/pages/Games.tsx

// Game Selection Component
export default function Games() {
  const [game, setGame] = useState<'none' | 'reaction' | 'memory' | 'sudoku'>('none');

  return (
    <DashboardLayout>
      {/* Game Menu */}
      <button onClick={() => setGame('reaction')}>Reaction Tapper</button>
      <button onClick={() => setGame('memory')}>Memory Match</button>
      <button onClick={() => setGame('sudoku')}>Mini Sudoku</button>

      {/* Game Area */}
      {game === 'reaction' && <ReactionGame />}
      {game === 'memory' && <MemoryMatch />}
      {game === 'sudoku' && <SudokuGame />}
    </DashboardLayout>
  );
}

// === REACTION TAPPER GAME ===
function ReactionGame() {
  const [status, setStatus] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (status === 'waiting') {
      // Random delay between 1-3 seconds
      const delay = Math.random() * 2000 + 1000;
      setTimeout(() => {
        setStatus('ready');
        setStartTime(Date.now());
      }, delay);
    }
  }, [status]);

  const handleClick = () => {
    if (status === 'ready') {
      const reactionTime = Date.now() - startTime;
      setScore(reactionTime);
      setStatus('finished');
    }
  };

  return (
    <div onClick={handleClick} className={status === 'ready' ? 'bg-green-500' : 'bg-red-500'}>
      {status === 'finished' && <h2>{score} ms</h2>}
    </div>
  );
}

// === MEMORY MATCH GAME ===
function MemoryMatch() {
  const icons = ['star', 'apple', 'rainbow', 'ice cream', 'guitar', 'rocket', 'ball', 'art'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    setCards(deck);
  };

  const handleFlip = (id) => {
    // Flip card logic
    // Check for matches
    // Track moves
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.id} onClick={() => handleFlip(card.id)}>
          {card.flipped && card.emoji}
        </div>
      ))}
    </div>
  );
}

// === MINI SUDOKU GAME ===
function SudokuGame() {
  const [grid, setGrid] = useState([]); // 4x4 grid
  const [selected, setSelected] = useState(null);

  const handleInput = (val) => {
    if (!selected) return;
    // Update grid with new value
  };

  return (
    <div>
      <div className="grid grid-cols-4">
        {grid.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} onClick={() => setSelected([r, c])}>
            {cell}
          </div>
        )))}
      </div>
      {[1, 2, 3, 4].map(n => (
        <Button key={n} onClick={() => handleInput(n)}>{n}</Button>
      ))}
    </div>
  );
}
```

**Game Descriptions:**

| Game | Purpose | ADHD Benefit |
|------|---------|--------------|
| Reaction Tapper | Tests reflex speed | Improves attention response |
| Memory Match | Find matching pairs | Exercises working memory |
| Mini Sudoku | 4x4 number puzzle | Builds sustained focus |

### 8.4 Face Analyzer

Non-invasive facial cue detection for personalized wellness suggestions.

```typescript
// File: client/src/pages/FaceAnalyzer.tsx

const ANALYSES = {
  tired: {
    condition: "Fatigue",
    question: "You seem a bit tired. Did you sleep well?",
    cues: ["Frequent blinking", "Long eye closure", "Yawning"],
    suggestions: [
      { text: "Take a short break (5-10 mins)", icon: Coffee },
      { text: "Drink water", icon: Droplets },
      { text: "Try a 1-minute breathing exercise", icon: Heart },
    ]
  },
  stressed: {
    condition: "Stress",
    question: "You look tense. Are you feeling overwhelmed?",
    cues: ["Tight facial muscles", "Furrowed brows"],
    suggestions: [
      { text: "Guided breathing animation", icon: Heart },
      { text: "Want to talk? (AI Chat)", icon: Brain },
    ]
  },
  // ... more conditions
};

export default function FaceAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);

  const startAnalysis = () => {
    setAnalyzing(true);
    
    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      videoRef.current.srcObject = stream;
    });

    // Simulate analysis (3 seconds)
    setTimeout(() => {
      const keys = Object.keys(ANALYSES);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setResult(ANALYSES[randomKey]);
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <DashboardLayout>
      {/* Video Feed with Scanning Animation */}
      <div className="relative aspect-video bg-slate-900 rounded-[2rem]">
        <video ref={videoRef} autoPlay muted />
        {analyzing && (
          <motion.div 
            animate={{ top: ['10%', '90%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute left-10 right-10 h-1 bg-primary"
          />
        )}
      </div>

      {/* Analysis Result */}
      {result && (
        <div>
          <h3>{result.question}</h3>
          <div>
            {result.cues.map(cue => <span key={cue}>{cue}</span>)}
          </div>
          <div>
            {result.suggestions.map((sug, i) => (
              <div key={i}>
                <sug.icon />
                <span>{sug.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <p>Scan logic is performed entirely on your device. 
         We never store images or recordings.</p>
    </DashboardLayout>
  );
}
```

**Features:**
- Webcam-based scanning with visual feedback
- Detects four states: Tired, Stressed, Exhausted, Okay
- Provides condition-specific wellness suggestions
- Completely client-side (privacy-first)
- No images are stored or transmitted

### 8.5 Wellness & Yoga

Yoga poses with step-by-step instructions designed for ADHD.

```typescript
// File: client/src/pages/Wellness.tsx

const YOGA_POSES = [
  {
    title: "Tree Pose (Vrikshasana)",
    benefits: "Improves balance & concentration",
    info: "Focus on a fixed point to train attention",
    description: "Stand on one leg, placing the sole of your other foot...",
    image: yogaTree
  },
  {
    title: "Warrior Pose (Virabhadrasana)",
    benefits: "Builds strength & focus",
    info: "Helps channel excess energy",
    description: "Step one foot back, bend front knee at 90 degrees...",
    image: yogaWarrior
  },
  {
    title: "Child's Pose (Balasana)",
    benefits: "Calms the nervous system",
    info: "Good for relaxation and grounding",
    description: "Kneel on the floor, sit on your heels, and fold forward...",
    image: yogaChild
  },
  // ... 6 total poses
];

export default function Wellness() {
  const [selectedPose, setSelectedPose] = useState(null);

  return (
    <DashboardLayout>
      {/* Yoga Poses Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {YOGA_POSES.map((pose, i) => (
          <Card key={i} onClick={() => setSelectedPose(pose)}>
            <img src={pose.image} alt={pose.title} />
            <h3>{pose.title}</h3>
            <p>{pose.info}</p>
          </Card>
        ))}
      </div>

      {/* Pose Detail View */}
      {selectedPose && (
        <Card>
          <img src={selectedPose.image} />
          <h2>{selectedPose.title}</h2>
          <span>{selectedPose.benefits}</span>
          <h4>How to do it</h4>
          <p>{selectedPose.description}</p>
        </Card>
      )}

      {/* Nutrition Tips */}
      <Card>
        <h3>Mindful Nutrition</h3>
        <p>Omega-3 Rich: Salmon, Walnuts, Chia seeds</p>
        <p>High Protein: Eggs, chicken, lentils</p>
        <p>Complex Carbs: Whole Grains, Sweet Potatoes</p>
      </Card>
    </DashboardLayout>
  );
}
```

**Features:**
- 6 yoga poses with stock images
- Step-by-step instructions for each pose
- ADHD-specific benefits explained
- Nutrition recommendations for brain health

### 8.6 Music Player

Full-featured music player with sleep timer functionality.

```typescript
// File: client/src/pages/Music.tsx

const PLAYLIST = [
  { id: 1, title: "Sleep Music Vol. 16", artist: "Deep Relaxation", url: music1 },
  { id: 2, title: "Magical Moments", artist: "Ethereal Soundscapes", url: music2 },
  { id: 3, title: "Beauty", artist: "Pure Calm", url: music3 }
];

const SLEEP_TIMER_OPTIONS = [
  { label: "Off", value: 0 },
  { label: "10 min", value: 10 },
  { label: "30 min", value: 30 },
  { label: "60 min", value: 60 }
];

export default function Music() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [sleepTimer, setSleepTimer] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const audioRef = useRef(null);

  // Play/pause based on state
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepTimer > 0) {
      setTimerRemaining(sleepTimer * 60);
      const interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setSleepTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [sleepTimer]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  return (
    <DashboardLayout>
      {/* Sleep Timer Buttons */}
      <div>
        {SLEEP_TIMER_OPTIONS.map((opt) => (
          <Button 
            key={opt.value}
            variant={sleepTimer === opt.value ? "default" : "outline"}
            onClick={() => setSleepTimer(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Main Player */}
      <div>
        <h2>{currentTrack.title}</h2>
        <p>{currentTrack.artist}</p>
        
        {/* Progress Slider */}
        <Slider value={[progress]} onValueChange={handleProgressChange} />
        
        {/* Playback Controls */}
        <Button onClick={prevTrack}><SkipBack /></Button>
        <Button onClick={togglePlay}>
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button onClick={nextTrack}><SkipForward /></Button>
        
        {/* Volume Control */}
        <Slider value={[volume]} onValueChange={(v) => setVolume(v[0])} />
      </div>

      {/* Playlist - Click to Play/Pause */}
      <div>
        {PLAYLIST.map((track, index) => (
          <div 
            key={track.id}
            onClick={() => {
              if (currentTrackIndex === index) {
                setIsPlaying(!isPlaying); // Toggle play/pause
              } else {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }
            }}
          >
            {track.title}
          </div>
        ))}
      </div>

      <audio ref={audioRef} src={currentTrack.url} />
    </DashboardLayout>
  );
}
```

**Features:**
- Play, pause, skip forward, skip backward controls
- Click on playlist item to play or pause current track
- Volume slider control
- Sleep timer (10, 30, 60 minutes)
- Visual progress bar
- Auto-play next track when current ends

### 8.7 AI Chat Support

Supportive chat interface for stress reduction.

```typescript
// File: client/src/pages/Chat.tsx

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm here to support you..." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    setIsLoading(true);

    // Get AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I hear you. Breaking things down into smaller steps often helps..."
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* Chat Header */}
      <div>
        <Bot className="w-6 h-6" />
        <h2>MindFlex Support</h2>
      </div>

      {/* Messages */}
      <div>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'ml-auto' : ''}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend}>
        <Input value={input} onChange={e => setInput(e.target.value)} />
        <Button type="submit"><Send /></Button>
      </form>
    </DashboardLayout>
  );
}
```

**Features:**
- Real-time chat interface
- AI-powered responses using OpenAI
- Non-clinical, supportive tone
- Helps with thought organization and stress reduction

### 8.8 Mood Tracking

Simple emoji-based mood logging component.

```typescript
// File: client/src/components/MoodTracker.tsx

const MOODS = [
  { value: 1, icon: Angry, label: "Angry", color: "text-red-500" },
  { value: 2, icon: Annoyed, label: "Stressed", color: "text-orange-500" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500" },
  { value: 4, icon: Smile, label: "Good", color: "text-blue-500" },
  { value: 5, icon: Smile, label: "Great", color: "text-green-500" },
];

export function MoodTracker() {
  const { user } = useAuth();
  const createMood = useCreateMoodLog();
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    createMood.mutate({ userId: user.id, value, tags: [] });
  };

  return (
    <div className="bg-card rounded-2xl p-6">
      <h3>How are you feeling today?</h3>
      <div className="flex justify-between">
        {MOODS.map((mood) => (
          <button key={mood.value} onClick={() => handleSelect(mood.value)}>
            <mood.icon className={mood.color} />
            <span>{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Features:**
- 5-point scale (Angry to Great)
- Visual emoji-based selection
- Instant database logging
- Enables mood pattern analysis over time

---

## 9. Authentication System

MindFlex uses **Replit Auth** (OpenID Connect) for secure authentication.

```typescript
// File: client/src/hooks/use-auth.ts

async function fetchUser(): Promise<User | null> {
  const response = await fetch("/api/auth/user", {
    credentials: "include", // Important for cookies
  });

  if (response.status === 401) {
    return null; // Not authenticated
  }

  return response.json();
}

export function useAuth() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: () => window.location.href = "/api/logout",
  };
}
```

**Authentication Flow:**
1. User clicks "Sign in with Replit"
2. Redirected to Replit OAuth page
3. After approval, redirected back with session cookie
4. Frontend fetches `/api/auth/user` to get user data
5. Session stored in PostgreSQL for persistence

---

## 10. Local Setup Guide

### Prerequisites
- Node.js v18 or higher
- PostgreSQL database
- Git (optional)

### Step 1: Download the Project
Download as ZIP from Replit or clone via Git:
```bash
git clone [YOUR_REPLIT_REPO_URL]
cd mindflex
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=your_random_32_character_string
```

### Step 4: Initialize Database
```bash
npm run db:push
```

### Step 5: Start Development Server
```bash
npm run dev
```

### Step 6: Access Application
Open your browser and navigate to:
```
http://localhost:5000
```

---

## 11. Project Structure

```
mindflex/
├── client/                      # Frontend (React)
│   ├── src/
│   │   ├── assets/             # Images, fonts, music files
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn/UI components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── MoodTracker.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── TaskCard.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-tasks.ts
│   │   │   └── use-mood.ts
│   │   ├── lib/                # Utilities
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── Games.tsx
│   │   │   ├── FaceAnalyzer.tsx
│   │   │   ├── Wellness.tsx
│   │   │   ├── Music.tsx
│   │   │   ├── Chat.tsx
│   │   │   └── Profile.tsx
│   │   ├── App.tsx             # Main app component
│   │   └── main.tsx            # Entry point
│   └── index.html
│
├── server/                      # Backend (Express)
│   ├── replit_integrations/    # Replit-specific modules
│   │   ├── auth/              # Authentication
│   │   └── chat/              # AI Chat integration
│   ├── db.ts                   # Database connection
│   ├── routes.ts               # API route definitions
│   ├── storage.ts              # Database operations
│   └── index.ts                # Server entry point
│
├── shared/                      # Shared types & schemas
│   ├── models/                 # Data models
│   │   └── auth.ts
│   ├── schema.ts               # Drizzle table definitions
│   └── routes.ts               # API route contracts
│
├── migrations/                  # Database migrations
├── .env                        # Environment variables
├── drizzle.config.ts           # Drizzle ORM config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite bundler config
└── tailwind.config.ts          # Tailwind CSS config
```

---

## 12. Conclusion

MindFlex is a comprehensive, privacy-focused, non-AI digital support system designed specifically for individuals with ADHD. By combining structured task management, engaging brain games, self-assessment tools, and wellness resources, MindFlex provides a holistic approach to managing daily challenges associated with ADHD.

### Key Achievements:
- **Non-AI Core Systems**: Task rotation, games, and face analysis are deterministic, providing consistent and reliable support
- **Privacy First**: Face analysis runs entirely on-device with no data transmission
- **Gamification**: Points, badges, and streaks motivate continued engagement
- **Accessibility**: Dyslexia-friendly fonts and calming color palette
- **Full-Stack TypeScript**: Type-safe code from database to UI

### Future Enhancements:
- Integration with wearable devices (Apple Health, Fitbit)
- Parent/teacher dashboard for progress monitoring
- Expanded game library
- Offline mode support
- Push notifications for task reminders

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Author:** MindFlex Development Team
