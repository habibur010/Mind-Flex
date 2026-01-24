import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useTasks, useCreateTask } from "@/hooks/use-tasks";
import { TaskCard } from "@/components/TaskCard";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export default function Tasks() {
  const { user } = useAuth();
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const [isOpen, setIsOpen] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: "",
    category: "morning",
  });

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-display">Your Tasks</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 shadow-lg shadow-primary/25">
              <Plus className="w-5 h-5 mr-2" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">What needs to be done?</Label>
                <Input
                  id="title"
                  placeholder="e.g. Read 10 pages"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">When?</Label>
                <Select 
                  value={newTask.category} 
                  onValueChange={(val) => setNewTask({ ...newTask, category: val })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-xl" disabled={createTask.isPending}>
                {createTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat} className="space-y-4">
              <h2 className="text-lg font-bold font-display capitalize flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  cat === 'morning' ? 'bg-orange-400' :
                  cat === 'afternoon' ? 'bg-blue-400' : 'bg-indigo-400'
                }`} />
                {cat}
              </h2>
              <div className="space-y-3">
                {tasks?.filter(t => t.category === cat).map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {tasks?.filter(t => t.category === cat).length === 0 && (
                  <div className="p-4 rounded-xl border border-dashed border-border/60 text-center text-sm text-muted-foreground">
                    No tasks for {cat}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
