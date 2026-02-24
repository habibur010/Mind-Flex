import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, RefreshCw, Calendar as CalendarIcon, Check, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { usePoints } from "@/hooks/use-points";
import { useToast } from "@/hooks/use-toast";

const ROTATING_TASKS = [
  { title: "Make the bed", category: "morning", info: "quick win, sets order" },
  { title: "Drink a glass of water", category: "morning", info: "hydration boosts alertness" },
  { title: "Write 1 priority for the day", category: "morning", info: "keeps focus manageable" },
  { title: "Stretch for 5 minutes", category: "morning", info: "wakes up body and mind" },
  { title: "Brain dump in a notebook", category: "morning", info: "clear mental clutter" },
  { title: "Listen to one upbeat song", category: "morning", info: "mood reset" },
  { title: "Open windows/curtains", category: "morning", info: "natural light helps regulate focus" },
  { title: "Tidy one small area", category: "morning", info: "reduces distractions" },
  { title: "Check planner/calendar briefly", category: "morning", info: "orient yourself" },
  { title: "Take a short walk", category: "afternoon", info: "movement improves focus" },
  { title: "Eat a simple breakfast", category: "morning", info: "fuel for attention" },
  { title: "Write 3 micro-goals", category: "afternoon", info: "break tasks into tiny steps" },
  { title: "2 minutes deep breathing", category: "morning", info: "calm nervous system" },
  { title: "Read one page of a book", category: "afternoon", info: "builds focus muscle" },
  { title: "Do a quick puzzle/game", category: "afternoon", info: "warms up brain" },
  { title: "Sketch/doodle for 3 minutes", category: "afternoon", info: "playful creativity" },
  { title: "Say one positive affirmation aloud", category: "morning", info: "confidence boost" },
  { title: "Set a 30-min phone timer", category: "morning", info: "reduce morning distractions" },
  { title: "Note one thing you did well yesterday", category: "evening", info: "self-encouragement" },
  { title: "Do a small self-care act", category: "evening", info: "sensory reset" },
  { title: "Plan one enjoyable activity for today", category: "morning", info: "motivation anchor" }
];

interface LocalTask {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  points: number;
}

const STORAGE_KEY = "mindflex_my_tasks";

function loadTasks(): LocalTask[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks: LocalTask[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export default function Tasks() {
  const [tasks, setTasks] = useState<LocalTask[]>(loadTasks);
  const [isOpen, setIsOpen] = useState(false);
  const { addPoints, removePoints, incrementTasksCompleted, decrementTasksCompleted } = usePoints();
  const { toast } = useToast();

  const [newTask, setNewTask] = useState({
    title: "",
    category: "morning",
  });

  const startDate = new Date(2024, 0, 1);
  const dayOffset = differenceInDays(new Date(), startDate) % 7;
  
  const dailyRotatingTasks = useMemo(() => {
    return ROTATING_TASKS.slice(dayOffset * 3, (dayOffset * 3) + 3);
  }, [dayOffset]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: LocalTask = {
      id: Date.now(),
      title: newTask.title.trim(),
      category: newTask.category,
      completed: false,
      points: 10,
    };

    const updated = [...tasks, task];
    setTasks(updated);
    saveTasks(updated);
    setIsOpen(false);
    setNewTask({ title: "", category: "morning" });
    toast({
      title: "Task created",
      description: `"${task.title}" added to your ${task.category} list.`,
    });
  };

  const handleToggle = (taskId: number) => {
    const updated = tasks.map(task => {
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
    });
    setTasks(updated);
    saveTasks(updated);
  };

  const handleDelete = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.completed) {
      removePoints(task.points);
      decrementTasksCompleted();
    }
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
  };

  const categories = ["morning", "afternoon", "evening"];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold font-display text-primary" data-testid="text-tasks-title">Your Tasks</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> {format(new Date(), "MMMM do, yyyy")}
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-primary hover:bg-primary/90 rounded-2xl h-12 px-8 shadow-xl shadow-primary/20 font-bold group"
              data-testid="button-add-task"
            >
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
                  data-testid="input-task-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="font-bold">When?</Label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(val) => setNewTask({ ...newTask, category: val })}
                >
                  <SelectTrigger className="rounded-2xl h-12 bg-muted/50 border-none" data-testid="select-task-category">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-2xl font-bold shadow-lg"
                data-testid="button-create-task"
              >
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const catTasks = tasks.filter(t => t.category === cat);
            return (
              <div key={cat} className="space-y-4">
                <h2 className="text-lg font-bold font-display capitalize flex items-center gap-3 px-2">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${
                    cat === 'morning' ? 'bg-orange-400 shadow-orange-400/20' :
                    cat === 'afternoon' ? 'bg-blue-400 shadow-blue-400/20' : 'bg-indigo-400 shadow-indigo-400/20'
                  }`} />
                  {cat}
                  {catTasks.length > 0 && (
                    <span className="text-xs text-muted-foreground font-normal">({catTasks.filter(t => t.completed).length}/{catTasks.length})</span>
                  )}
                </h2>
                <div className="space-y-3">
                  {catTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "group relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg",
                        task.completed 
                          ? "bg-muted/30 border-border opacity-70" 
                          : "bg-card border-border/50 shadow-sm hover:-translate-y-1"
                      )}
                      data-testid={`task-card-${task.id}`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleToggle(task.id)}
                          data-testid={`button-toggle-task-${task.id}`}
                          className={cn(
                            "w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                            task.completed
                              ? "bg-primary border-primary text-white"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {task.completed && <Check className="w-4 h-4" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-semibold text-sm transition-all",
                            task.completed && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">+{task.points} pts</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(task.id)}
                          data-testid={`button-delete-task-${task.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {catTasks.length === 0 && (
                    <div className="p-8 rounded-[2rem] border border-dashed border-border/60 text-center text-sm text-muted-foreground bg-muted/20">
                      No personal tasks for {cat}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
