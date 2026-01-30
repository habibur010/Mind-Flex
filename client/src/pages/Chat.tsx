import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User as UserIcon, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Problem {
  id: number;
  issue: string;
  solutions: string[];
}

const PROBLEMS: Problem[] = [
  {
    id: 1,
    issue: "Easily distracted, difficulty finishing tasks",
    solutions: [
      "Use timers (Pomodoro technique: 25 min focus + 5 min break)",
      "Break tasks into smaller steps",
      "Remove distractions (quiet workspace, phone limits)"
    ]
  },
  {
    id: 2,
    issue: "Acting without thinking, interrupting, risky decisions",
    solutions: [
      "Practice pause techniques (count to 5 before responding)",
      "Use role-play games like Simon Says to train impulse control",
      "Keep a journal to reflect before acting"
    ]
  },
  {
    id: 3,
    issue: "Constant movement, difficulty sitting still",
    solutions: [
      "Channel energy into exercise (running, yoga, dance)",
      "Use fidget tools (stress balls, doodling)",
      "Schedule short movement breaks during study/work"
    ]
  },
  {
    id: 4,
    issue: "Anger, stress, mood swings",
    solutions: [
      "Breathing exercises (inhale 4, exhale 6)",
      "Yoga poses like Child's Pose or Tree Pose",
      "Talk to a trusted friend or mentor when emotions rise"
    ]
  },
  {
    id: 5,
    issue: "Poor organization, procrastination, forgetfulness",
    solutions: [
      "Use planners, to-do lists, or digital apps",
      "Color-code tasks for priority",
      "Set reminders for deadlines and routines"
    ]
  },
  {
    id: 6,
    issue: "Missed deadlines, inconsistent performance",
    solutions: [
      "Study in short, focused sessions",
      "Ask for clear instructions and feedback",
      "Use visual aids (charts, diagrams) to understand better"
    ]
  },
  {
    id: 7,
    issue: "Interrupting, forgetting commitments, miscommunication",
    solutions: [
      "Practice active listening (repeat back what you heard)",
      "Use reminders for birthdays, meetings, promises",
      "Be open about ADHD with close friends/family for understanding"
    ]
  },
  {
    id: 8,
    issue: "Feeling inadequate, anxiety, depression",
    solutions: [
      "Celebrate small wins daily",
      "Keep a gratitude journal",
      "Seek ADHD coaching or professional support"
    ]
  }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'solutions';
  solutions?: { issue: string; tips: string[] }[];
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hi there! I'm your MindFlex support companion. Please select the challenges you're facing today, and I'll provide personalized strategies to help you manage them.", 
      type: 'text' 
    }
  ]);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [showProblemList, setShowProblemList] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleProblem = (id: number) => {
    setSelectedProblems(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmitProblems = () => {
    if (selectedProblems.length === 0) return;

    const selectedIssues = PROBLEMS.filter(p => selectedProblems.includes(p.id));
    const issueNames = selectedIssues.map(p => p.issue).join(", ");

    // Add user message showing what they selected
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `I'm struggling with: ${issueNames}`,
      type: 'text'
    }]);

    setIsLoading(true);
    setShowProblemList(false);

    // Simulate typing delay then show solutions
    setTimeout(() => {
      const solutionsData = selectedIssues.map(p => ({
        issue: p.issue,
        tips: p.solutions
      }));

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Here are some strategies that can help you:",
        type: 'solutions',
        solutions: solutionsData
      }]);

      // Follow-up message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Remember, it's okay to take things one step at a time. Would you like to discuss any of these strategies in more detail, or do you have other concerns you'd like help with?",
          type: 'text'
        }]);
        setIsLoading(false);
      }, 500);
    }, 1000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'text' }]);
    setIsLoading(true);

    // Simple response based on keywords
    setTimeout(() => {
      let response = "I hear you. Remember, you're doing great by seeking support. Would you like me to show the problem list again so you can explore more strategies?";
      
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes("yes") || lowerMsg.includes("more") || lowerMsg.includes("show") || lowerMsg.includes("list")) {
        response = "Sure! I'll show you the problem list again. Feel free to select any challenges you'd like help with.";
        setTimeout(() => {
          setShowProblemList(true);
          setSelectedProblems([]);
        }, 500);
      } else if (lowerMsg.includes("thank")) {
        response = "You're very welcome! Remember, every small step counts. I'm always here whenever you need support.";
      } else if (lowerMsg.includes("help") || lowerMsg.includes("struggling")) {
        response = "I understand. Let me show you the problem list so you can select what you're dealing with, and I'll provide tailored strategies.";
        setTimeout(() => {
          setShowProblemList(true);
          setSelectedProblems([]);
        }, 500);
      } else if (lowerMsg.includes("pomodoro") || lowerMsg.includes("timer") || lowerMsg.includes("focus")) {
        response = "The Pomodoro technique is wonderful! Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. This helps maintain focus without burnout. Would you like tips on any other strategies?";
      } else if (lowerMsg.includes("breathing") || lowerMsg.includes("calm") || lowerMsg.includes("relax")) {
        response = "Breathing exercises are very effective! Try this: Breathe in slowly for 4 counts, hold for 2 counts, then exhale for 6 counts. Repeat 5-10 times. This activates your body's relaxation response.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response, type: 'text' }]);
      setIsLoading(false);
    }, 1000);
  };

  const resetChat = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Hi there! I'm your MindFlex support companion. Please select the challenges you're facing today, and I'll provide personalized strategies to help you manage them.", 
      type: 'text' 
    }]);
    setSelectedProblems([]);
    setShowProblemList(true);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold">MindFlex Support</h2>
              <p className="text-xs text-muted-foreground">Your ADHD wellness companion</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetChat}
            data-testid="button-reset-chat"
            title="Start new conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-3",
              msg.role === 'user' ? "ml-auto flex-row-reverse max-w-[85%]" : "max-w-[90%]"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'user' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
              )}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-accent text-accent-foreground rounded-tr-none" 
                  : "bg-muted text-foreground rounded-tl-none"
              )}>
                {msg.content}
                
                {/* Render solutions if present */}
                {msg.type === 'solutions' && msg.solutions && (
                  <div className="mt-4 space-y-4">
                    {msg.solutions.map((sol, idx) => (
                      <div key={idx} className="bg-background/50 rounded-xl p-4 border border-border/50">
                        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          {sol.issue}
                        </h4>
                        <ul className="space-y-2">
                          {sol.tips.map((tip, tipIdx) => (
                            <li key={tipIdx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}

          {/* Problem Selection List */}
          {showProblemList && !isLoading && (
            <div className="bg-muted/50 rounded-2xl p-4 border border-border/50">
              <p className="text-sm font-medium mb-3 text-foreground">Select the challenges you're facing:</p>
              <div className="space-y-2">
                {PROBLEMS.map(problem => (
                  <button
                    key={problem.id}
                    onClick={() => toggleProblem(problem.id)}
                    data-testid={`problem-${problem.id}`}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all",
                      selectedProblems.includes(problem.id)
                        ? "bg-primary/10 border-2 border-primary text-foreground"
                        : "bg-background border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {selectedProblems.includes(problem.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                    )}
                    <span>{problem.issue}</span>
                  </button>
                ))}
              </div>
              
              {selectedProblems.length > 0 && (
                <Button 
                  onClick={handleSubmitProblems}
                  data-testid="button-submit-problems"
                  className="w-full mt-4 rounded-xl"
                >
                  Get Solutions for {selectedProblems.length} {selectedProblems.length === 1 ? 'Issue' : 'Issues'}
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message or ask for more help..."
              data-testid="input-chat-message"
              className="rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading}
              data-testid="button-send-message"
              className="rounded-full w-10 h-10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
