import { useState, useMemo } from "react";
import { useCreateMoodLog } from "@/hooks/use-mood";
import { Smile, Frown, Meh, Annoyed, Angry, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const MOODS = [
  { value: 1, icon: Angry, label: "Angry", color: "text-red-500 bg-red-50" },
  { value: 2, icon: Annoyed, label: "Stressed", color: "text-orange-500 bg-orange-50" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500 bg-yellow-50" },
  { value: 4, icon: Smile, label: "Good", color: "text-blue-500 bg-blue-50" },
  { value: 5, icon: Smile, label: "Great", color: "text-green-500 bg-green-50" },
];

const MOOD_COMMENTS: Record<number, string[]> = {
  1: [
    "Let's pause and take 3 deep breaths together.",
    "How about a quick walk or stretch to release that energy?",
    "Would you like to write down what's bothering you instead of holding it in?"
  ],
  2: [
    "Let's break things into smaller steps so it feels lighter.",
    "Maybe a short game, music, or yoga pose could help reset your mind.",
    "You're not alone—talking it out might ease the load."
  ],
  3: [
    "That's steady progress—want to try a small focus exercise to keep the momentum?",
    "How about a short breathing break to stay balanced?",
    "Let's plan one enjoyable activity today to keep the mood stable."
  ],
  4: [
    "That's great—let's channel this energy into something creative or productive.",
    "Want to celebrate with a quick game or a fun challenge?",
    "Maybe write down what's working well so you can repeat it later."
  ],
  5: [
    "Amazing! Let's set a mini-goal to make the most of this energy.",
    "Share your good mood—it might inspire others too.",
    "Would you like to try something new or adventurous while you're feeling this way?"
  ]
};

function getRandomComments(moodValue: number): string[] {
  const comments = MOOD_COMMENTS[moodValue] || [];
  const shuffled = [...comments].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

export function MoodTracker() {
  const { user } = useAuth();
  const createMood = useCreateMoodLog();
  const [selected, setSelected] = useState<number | null>(null);
  const [displayedComments, setDisplayedComments] = useState<string[]>([]);

  const handleSelect = (value: number) => {
    setSelected(value);
    setDisplayedComments(getRandomComments(value));
    if (user) {
      createMood.mutate({ userId: user.id, value, tags: [] });
    }
  };

  const selectedMood = MOODS.find(m => m.value === selected);

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
      <h3 className="text-xl font-bold mb-4 font-display">How are you feeling today?</h3>
      <div className="flex justify-between items-center gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            disabled={createMood.isPending}
            data-testid={`mood-button-${mood.label.toLowerCase()}`}
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
      
      {selected && displayedComments.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span>Suggestions for you</span>
          </div>
          {displayedComments.map((comment, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-4 rounded-xl text-sm leading-relaxed",
                selectedMood?.color || "bg-muted"
              )}
            >
              {comment}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
