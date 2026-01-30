import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    id: "struggle",
    question: "What do you struggle with the most right now?",
    type: "single",
    options: [
      { value: "focus", label: "Staying focused" },
      { value: "emotions", label: "Managing emotions" },
      { value: "overwhelmed", label: "Feeling overwhelmed" },
      { value: "starting", label: "Getting things started" },
      { value: "routines", label: "Maintaining routines" },
    ],
  },
  {
    id: "overwhelmed",
    question: "How often do you feel mentally overwhelmed during the day?",
    type: "single",
    options: [
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "always", label: "Almost always" },
    ],
  },
  {
    id: "productiveTime",
    question: "When do you feel most productive?",
    type: "single",
    options: [
      { value: "morning", label: "Morning" },
      { value: "afternoon", label: "Afternoon" },
      { value: "evening", label: "Evening" },
      { value: "varies", label: "It changes every day" },
    ],
  },
  {
    id: "moodImpact",
    question: "How does your mood usually affect your work or studies?",
    type: "single",
    options: [
      { value: "not_much", label: "It doesn't affect me much" },
      { value: "lose_focus", label: "I lose focus easily" },
      { value: "anxious", label: "I feel anxious or stressed" },
      { value: "avoid", label: "I avoid tasks completely" },
    ],
  },
  {
    id: "supportNeeded",
    question: "What kind of support would help you the most?",
    type: "multiple",
    options: [
      { value: "small_steps", label: "Breaking tasks into small steps" },
      { value: "check_ins", label: "Emotional check-ins" },
      { value: "calming", label: "Calming exercises (breathing, focus games)" },
      { value: "reminders", label: "Gentle reminders and motivation" },
    ],
  },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

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
      const storedUser = localStorage.getItem("mindflex_temp_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.onboardingCompleted = true;
        user.onboardingResponses = answers;
        localStorage.setItem("mindflex_temp_user", JSON.stringify(user));
      }
      window.location.href = "/api/login";
    }
  };

  const isSelected = (value: string) => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "multiple") {
      return Array.isArray(answer) && answer.includes(value);
    }
    return answer === value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold font-display text-foreground">MindFlex</span>
          </div>
          <h2 className="text-xl font-display text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Let's get to know you better
          </h2>
        </div>

        <div className="mb-6">
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

        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-8">
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
                  disabled={!isCurrentAnswered()}
                  className="w-full h-14 rounded-xl text-lg font-bold mt-6"
                  data-testid="button-next"
                >
                  {currentStep === totalSteps - 1 ? (
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
          Your answers help us personalize your experience
        </p>
      </div>
    </div>
  );
}
