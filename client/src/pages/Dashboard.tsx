import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MoodTracker } from "@/components/MoodTracker";
import { Zap, Target, Trophy, ArrowRight, Quote, Check, Trash2, Clock } from "lucide-react";
import { Link } from "wouter";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePoints } from "@/hooks/use-points";
import dashboardBg from "@assets/background-formed-by-pink-peach-blue-blur-space-perfect-desig_1769638325387.avif";

const DAILY_MESSAGES = [
  "Gratitude first - I'm thankful for waking up today and having another chance to grow.",
  "Fresh start mindset - Yesterday is gone; today is a blank page I get to write on.",
  "Small wins matter - Even tiny steps forward are progress worth celebrating.",
  "Self-kindness - I don't need to be perfect; I just need to keep trying.",
  "Energy check - I choose to focus my energy on what uplifts me, not what drains me.",
  "Possibility lens - Something good can happen today, even in unexpected ways.",
  "Confidence boost - I have the skills, strength, and creativity to handle whatever comes."
];

const INITIAL_TASKS = [
  { id: 1, title: "Take a 5-minute stretch break", category: "morning", completed: false, points: 10 },
  { id: 2, title: "Write down 3 things you're grateful for", category: "morning", completed: false, points: 15 },
  { id: 3, title: "Drink a glass of water", category: "afternoon", completed: false, points: 5 },
];

interface LocalTask {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  points: number;
}

function LocalTaskCard({ 
  task, 
  onToggle, 
  onDelete 
}: { 
  task: LocalTask; 
  onToggle: () => void; 
  onDelete: () => void;
}) {
  return (
    <div className={cn(
      "group relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg",
      task.completed 
        ? "bg-muted/30 border-border opacity-70" 
        : "bg-card border-border/50 shadow-sm hover:-translate-y-1"
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          data-testid={`toggle-task-${task.id}`}
          className={cn(
            "mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
            task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-muted-foreground/30 hover:border-primary text-transparent hover:bg-primary/5"
          )}
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </button>

        <div className="flex-1">
          <h3 className={cn(
            "font-semibold text-lg transition-all",
            task.completed ? "text-muted-foreground line-through decoration-2" : "text-foreground"
          )}>
            {task.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-3">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              task.category === 'morning' ? "bg-orange-100 text-orange-700" :
              task.category === 'afternoon' ? "bg-blue-100 text-blue-700" :
              "bg-indigo-100 text-indigo-700"
            )}>
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Today
            </span>
            <span className="text-xs text-green-600 font-medium">
              +{task.points} pts
            </span>
          </div>
        </div>

        <button
          onClick={onDelete}
          data-testid={`delete-task-${task.id}`}
          className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const userName = "Friend";
  const [tasks, setTasks] = useState<LocalTask[]>(INITIAL_TASKS);
  const { points, streak, addPoints, removePoints, incrementTasksCompleted, decrementTasksCompleted } = usePoints();

  const startDate = new Date(2024, 0, 1);
  const dayIndex = differenceInDays(new Date(), startDate) % 7;
  const dailyMessage = DAILY_MESSAGES[dayIndex];

  const handleToggleTask = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          addPoints(task.points);
          incrementTasksCompleted();
        } else {
          removePoints(task.points);
          decrementTasksCompleted();
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const incompleteTasks = tasks.filter(t => !t.completed);

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Hi, {userName}!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            It's {format(new Date(), "EEEE, MMMM do")}. Ready to find your flow?
          </p>
        </div>
        
        {/* Streak Badge */}
        <div className="bg-white border border-border px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <Zap className="w-5 h-5 text-orange-600 fill-orange-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Daily Streak</p>
            <p className="text-xl font-bold text-foreground">{streak} Days</p>
          </div>
        </div>
      </div>

      {/* Daily Message Container */}
      <div className="relative w-full h-48 rounded-[2rem] overflow-hidden mb-8 shadow-xl group">
        <img 
          src={dashboardBg} 
          alt="Dashboard Background" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-blue-400/20 backdrop-blur-[2px] transition-colors group-hover:bg-blue-400/10" />
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <Quote className="w-8 h-8 text-white/40 mb-4" />
          <p className="text-xl md:text-2xl font-display font-bold text-white drop-shadow-lg max-w-2xl leading-relaxed">
            {dailyMessage}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Mood Tracker */}
          <MoodTracker />

          {/* Today's Focus */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" /> Today's Focus
              </h2>
              <Link href="/tasks" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {incompleteTasks.length > 0 ? (
                incompleteTasks.map(task => (
                  <LocalTaskCard 
                    key={task.id} 
                    task={task} 
                    onToggle={() => handleToggleTask(task.id)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))
              ) : (
                <div className="p-8 border border-dashed border-border rounded-2xl text-center">
                  <p className="text-muted-foreground">All tasks completed! Great job!</p>
                  <Link href="/tasks" className="mt-4 inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">Add More Tasks</Link>
                </div>
              )}
            </div>

            {/* Show completed tasks */}
            {tasks.filter(t => t.completed).length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Completed today:</p>
                <div className="space-y-2">
                  {tasks.filter(t => t.completed).map(task => (
                    <LocalTaskCard 
                      key={task.id} 
                      task={task} 
                      onToggle={() => handleToggleTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Access Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/games">
              <div className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                <h3 className="text-xl font-bold font-display">Brain Games</h3>
                <p className="text-white/80 mt-1 mb-4">Sharpen your focus with quick puzzles.</p>
                <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  Play Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/wellness">
              <div className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                <h3 className="text-xl font-bold font-display">Breathe & Move</h3>
                <p className="text-white/80 mt-1 mb-4">Reset your nervous system.</p>
                <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  Start Session <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Progress Card */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h3 className="font-bold font-display text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" /> Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Points</span>
                <span className="font-bold text-lg">{points}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((points / 100) * 100, 100)}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {Math.max(0, 100 - points)} points to next level!
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
