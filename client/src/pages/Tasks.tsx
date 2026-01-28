import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { TaskCard } from "@/components/TaskCard";
import { Plus, Loader2, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { format, differenceInDays } from "date-fns";

const ROTATING_TASKS = [
  // Day 1
  { title: "Make the bed", category: "morning", info: "quick win, sets order" },
  { title: "Drink a glass of water", category: "morning", info: "hydration boosts alertness" },
  { title: "Write 1 priority for the day", category: "morning", info: "keeps focus manageable" },
  // Day 2
  { title: "Stretch for 5 minutes", category: "morning", info: "wakes up body and mind" },
  { title: "Brain dump in a notebook", category: "morning", info: "clear mental clutter" },
  { title: "Listen to one upbeat song", category: "morning", info: "mood reset" },
  // Day 3
  { title: "Open windows/curtains", category: "morning", info: "natural light helps regulate focus" },
  { title: "Tidy one small area", category: "morning", info: "reduces distractions" },
  { title: "Check planner/calendar briefly", category: "morning", info: "orient yourself" },
  // Day 4
  { title: "Take a short walk", category: "afternoon", info: "movement improves focus" },
  { title: "Eat a simple breakfast", category: "morning", info: "fuel for attention" },
  { title: "Write 3 micro-goals", category: "afternoon", info: "break tasks into tiny steps" },
  // Day 5
  { title: "2 minutes deep breathing", category: "morning", info: "calm nervous system" },
  { title: "Read one page of a book", category: "afternoon", info: "builds focus muscle" },
  { title: "Do a quick puzzle/game", category: "afternoon", info: "warms up brain" },
  // Day 6
  { title: "Sketch/doodle for 3 minutes", category: "afternoon", info: "playful creativity" },
  { title: "Say one positive affirmation aloud", category: "morning", info: "confidence boost" },
  { title: "Set a 30-min phone timer", category: "morning", info: "reduce morning distractions" },
  // Day 7
  { title: "Note one thing you did well yesterday", category: "evening", info: "self-encouragement" },
  { title: "Do a small self-care act", category: "evening", info: "sensory reset" },
  { title: "Plan one enjoyable activity for today", category: "morning", info: "motivation anchor" }
];

export default function Tasks() {
  const { user } = useAuth();
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const [isOpen, setIsOpen] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: "",
    category: "morning",
  });

  const startDate = new Date(2024, 0, 1);
  const dayOffset = differenceInDays(new Date(), startDate) % 7;
  
  const dailyRotatingTasks = useMemo(() => {
    return ROTATING_TASKS.slice(dayOffset * 3, (dayOffset * 3) + 3);
  }, [dayOffset]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await createTask.mutateAsync({
      userId: user.id,
      title: newTask.title,
      category: newTask.category,
      completed: false
    });
    setIsOpen(false);
    setNewTask({ title: "", category: "morning" });
  };

  const categories = ["morning", "afternoon", "evening"];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display text-primary">Your Tasks</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> {format(new Date(), "MMMM do, yyyy")}
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-2xl h-12 px-8 shadow-xl shadow-primary/20 font-bold group">
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" /> Add My Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">New Adventure</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">What needs to be done?</Label>
                <Input
                  id="title"
                  placeholder="e.g. Read 10 pages"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="rounded-2xl h-12 bg-muted/50 border-none focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="font-bold">When?</Label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(val) => setNewTask({ ...newTask, category: val })}
                >
                  <SelectTrigger className="rounded-2xl h-12 bg-muted/50 border-none">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-12 rounded-2xl font-bold shadow-lg" disabled={createTask.isPending}>
                {createTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Rotation Section */}
      <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <RefreshCw className="w-32 h-32 rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Daily Rotation</span>
            <h2 className="text-2xl font-bold font-display">Day {dayOffset + 1} Focus</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {dailyRotatingTasks.map((task, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-black text-xs">{i + 1}</span>
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{task.category}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight mb-2">{task.title}</h3>
                <p className="text-xs text-muted-foreground italic">— {task.info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-display px-2">My List</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat} className="space-y-4">
                <h2 className="text-lg font-bold font-display capitalize flex items-center gap-3 px-2">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${
                    cat === 'morning' ? 'bg-orange-400 shadow-orange-400/20' :
                    cat === 'afternoon' ? 'bg-blue-400 shadow-blue-400/20' : 'bg-indigo-400 shadow-indigo-400/20'
                  }`} />
                  {cat}
                </h2>
                <div className="space-y-3">
                  {tasks?.filter(t => t.category === cat).map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  {tasks?.filter(t => t.category === cat).length === 0 && (
                    <div className="p-8 rounded-[2rem] border border-dashed border-border/60 text-center text-sm text-muted-foreground bg-muted/20">
                      No personal tasks for {cat}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
