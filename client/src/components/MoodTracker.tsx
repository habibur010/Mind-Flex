import { useState } from "react";
import { useCreateMoodLog } from "@/hooks/use-mood";
import { Smile, Frown, Meh, Annoyed, Angry } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const MOODS = [
  { value: 1, icon: Angry, label: "Angry", color: "text-red-500 bg-red-50" },
  { value: 2, icon: Annoyed, label: "Stressed", color: "text-orange-500 bg-orange-50" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500 bg-yellow-50" },
  { value: 4, icon: Smile, label: "Good", color: "text-blue-500 bg-blue-50" },
  { value: 5, icon: Smile, label: "Great", color: "text-green-500 bg-green-50" },
];

export function MoodTracker() {
  const { user } = useAuth();
  const createMood = useCreateMoodLog();
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelected(value);
    if (user) {
      createMood.mutate({ userId: user.id, value, tags: [] });
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
      <h3 className="text-xl font-bold mb-4 font-display">How are you feeling today?</h3>
      <div className="flex justify-between items-center gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            disabled={createMood.isPending}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-110",
              selected === mood.value ? `${mood.color} ring-2 ring-primary/20 scale-110` : "hover:bg-muted"
            )}
          >
            <mood.icon className={cn("w-8 h-8", selected === mood.value ? "fill-current opacity-100" : "opacity-70")} />
            <span className="text-xs font-medium text-muted-foreground">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
