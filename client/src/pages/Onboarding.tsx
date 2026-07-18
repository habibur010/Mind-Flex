import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, Check, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const QUESTIONS = [
  {
    id: "struggle",
    question: "What do you struggle with most?",
    type: "single",
    options: [
      { value: "focus", label: "Staying focused on tasks" },
      { value: "starting", label: "Getting started on things" },
      { value: "organizing", label: "Keeping things organized" },
      { value: "emotions", label: "Managing emotions" },
      { value: "time", label: "Tracking time" },
    ],
  },
  {
    id: "overwhelm",
    question: "How often do you feel overwhelmed?",
    type: "single",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "always", label: "Almost always" },
    ],
  },
  {
    id: "productive_time",
    question: "When are you most productive?",
    type: "single",
    options: [
      { value: "morning", label: "Early morning" },
      { value: "midday", label: "Mid-day" },
      { value: "afternoon", label: "Afternoon" },
      { value: "evening", label: "Evening" },
      { value: "night", label: "Late night" },
      { value: "varies", label: "It varies a lot" },
    ],
  },
  {
    id: "mood_impact",
    question: "How much does your mood affect your work?",
    type: "single",
    options: [
      { value: "little", label: "Not much" },
      { value: "some", label: "Somewhat" },
      { value: "lot", label: "A lot" },
      { value: "completely", label: "It completely depends on my mood" },
    ],
  },
  {
    id: "help_wanted",
    question: "What would help you the most?",
    type: "multiple",
    options: [
      { value: "tasks", label: "Breaking tasks into smaller steps" },
      { value: "reminders", label: "Gentle reminders" },
      { value: "games", label: "Fun brain games" },
      { value: "relaxation", label: "Relaxation tools" },
      { value: "tracking", label: "Progress tracking" },
      { value: "chat", label: "Someone to talk to" },
    ],
  },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const currentQuestion = QUESTIONS[currentStep];
  const totalSteps = QUESTIONS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSingleSelect = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleMultipleSelect = (value: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    if (current.includes(value)) {
      setAnswers({ ...answers, [currentQuestion.id]: current.filter((v) => v !== value) });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: [...current, value] });
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id];
    if (Array.isArray(answer)) {
      return answer.includes(value);
    }
    return answer === value;
  };

  const isCurrentAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "multiple") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return !!answer;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSaving(true);
      localStorage.setItem("mindflex_onboarding", JSON.stringify(answers));
      
      fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: answers }),
        credentials: "include",
      })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to save onboarding online");
        }
        return res.json();
      })
      .then(() => {
        toast({
          title: "Welcome to MindFlex!",
          description: "Your personalized experience is ready and synced.",
        });
        setLocation("/dashboard");
      })
      .catch((err) => {
        console.error("Onboarding sync failed:", err);
        toast({
          title: "Welcome to MindFlex!",
          description: "Your personalized experience is ready.",
        });
        setLocation("/dashboard");
      })
      .finally(() => {
        setIsSaving(false);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold font-display text-foreground">MindFlex</span>
          </div>
          <p className="text-muted-foreground">Let's personalize your experience</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[2rem]">
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold font-display text-center leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {currentQuestion.type === "multiple" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Select all that apply
                  </p>
                )}

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        currentQuestion.type === "multiple"
                          ? handleMultipleSelect(option.value)
                          : handleSingleSelect(option.value)
                      }
                      data-testid={`option-${option.value}`}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between",
                        isSelected(option.value)
                          ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
                          : "bg-muted/50 hover:bg-muted text-foreground"
                      )}
                    >
                      <span className="font-medium">{option.label}</span>
                      {isSelected(option.value) && (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!isCurrentAnswered() || isSaving}
                  className="w-full h-14 rounded-xl text-lg font-bold mt-6"
                  data-testid="button-next"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
                    </>
                  ) : currentStep === totalSteps - 1 ? (
                    <>
                      Finish & Go to Dashboard <Sparkles className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          No worries, you can change these anytime!
        </p>
      </div>
    </div>
  );
}
