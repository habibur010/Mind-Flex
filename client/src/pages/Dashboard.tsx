import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { useUserStats } from "@/hooks/use-user";
import { TaskCard } from "@/components/TaskCard";
import { MoodTracker } from "@/components/MoodTracker";
import { Zap, Target, Trophy, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: tasks } = useTasks();
  const { data: stats } = useUserStats();

  // Filter tasks for Today
  const todayTasks = tasks?.filter(t => !t.completed).slice(0, 3) || [];

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-foreground">
            Hi, {user?.firstName || 'Friend'}! 👋
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
            <p className="text-xl font-bold text-foreground">{stats?.streak || 0} Days</p>
          </div>
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
              {todayTasks.length > 0 ? (
                todayTasks.map(task => <TaskCard key={task.id} task={task} />)
              ) : (
                <div className="p-8 border border-dashed border-border rounded-2xl text-center">
                  <p className="text-muted-foreground">No pending tasks! Enjoy the calm.</p>
                  <Link href="/tasks" className="mt-4 inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">Add a Task</Link>
                </div>
              )}
            </div>
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
                <span className="font-bold text-lg">{stats?.points || 0}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(((stats?.points || 0) / 1000) * 100, 100)}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {1000 - (stats?.points || 0)} points to next level!
              </p>
            </div>
          </div>

          {/* Quote of the Day */}
          <div className="bg-gradient-to-br from-orange-100 to-amber-50 p-6 rounded-2xl border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold font-display text-lg text-orange-900 mb-2">Daily Thought</h3>
              <p className="italic text-orange-800 font-hand text-lg leading-relaxed">
                "Your direction is more important than your speed."
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-orange-200 opacity-50">
              <Zap className="w-24 h-24" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
