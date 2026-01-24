import { Task } from "@shared/schema";
import { Check, Trash2, Clock } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function TaskCard({ task }: { task: Task }) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleToggle = () => {
    updateTask.mutate({ id: task.id, completed: !task.completed });
  };

  return (
    <div className={cn(
      "group relative p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg",
      task.completed 
        ? "bg-muted/30 border-border opacity-70" 
        : "bg-card border-border/50 shadow-sm hover:-translate-y-1"
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={updateTask.isPending}
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
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
          
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
              {task.date ? format(new Date(task.date), "MMM d") : "Today"}
            </span>
          </div>
        </div>

        <button
          onClick={() => deleteTask.mutate(task.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
