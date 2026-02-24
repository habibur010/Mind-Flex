import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Bot, CheckCircle2, Circle, RefreshCw, Send, MessageCircle, ListChecks, Sparkles, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const N8N_WEBHOOK_URL = "";

const QUICK_PROMPTS = [
  "I'm feeling overwhelmed today",
  "How can I manage anxiety?",
  "I can't focus on anything",
  "Tips for better sleep with ADHD",
  "I'm feeling really low right now",
  "How to deal with racing thoughts?"
];

function ProblemSupport() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hi there! I'm your MindFlex support companion. Please select the challenges you're facing today, and I'll provide personalized strategies to help you manage them.", 
      type: 'text' 
    }
  ]);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [showProblemList, setShowProblemList] = useState(true);
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

    setMessages(prev => [...prev, { 
      role: 'user', 
      content: `I'm struggling with: ${issueNames}`,
      type: 'text'
    }]);

    setIsLoading(true);
    setShowProblemList(false);

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

      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Remember, it's okay to take things one step at a time. You can select more challenges below if you'd like additional strategies.",
          type: 'text'
        }]);
        setIsLoading(false);
        setShowProblemList(true);
        setSelectedProblems([]);
      }, 500);
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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Select your challenges and get instant strategies</p>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={resetChat}
          data-testid="button-reset-problems"
          title="Start new conversation"
          className="h-8 w-8"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

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
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-accent text-accent-foreground rounded-tr-none" 
                : "bg-muted text-foreground rounded-tl-none"
            )}>
              {msg.content}
              
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
    </div>
  );
}

function N8NChatbot() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your psychological wellness assistant powered by AI. I'm here to help you with mental health suggestions, coping strategies, and emotional support. How are you feeling today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isTyping) return;

    setInput("");
    setError(null);

    setChatMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    if (!N8N_WEBHOOK_URL) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: getOfflineResponse(text)
        }]);
        setIsTyping(false);
      }, 1200);
      return;
    }

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          sessionId: 'mindflex-user',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const botReply = data.output || data.response || data.message || data.text || "I received your message but couldn't process it properly. Please try again.";

      setChatMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      setError("Couldn't connect to the AI service. Using offline suggestions instead.");
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: getOfflineResponse(text)
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setChatMessages([{
      role: 'assistant',
      content: "Hello! I'm your psychological wellness assistant powered by AI. I'm here to help you with mental health suggestions, coping strategies, and emotional support. How are you feeling today?"
    }]);
    setInput("");
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            N8N_WEBHOOK_URL ? "bg-green-500" : "bg-amber-500"
          )} />
          <p className="text-xs text-muted-foreground">
            {N8N_WEBHOOK_URL ? "Connected to n8n AI" : "Offline mode (connect n8n for full AI)"}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={resetChat}
          data-testid="button-reset-n8n-chat"
          title="Start new conversation"
          className="h-8 w-8"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {chatMessages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex gap-3",
              msg.role === 'user' ? "ml-auto flex-row-reverse max-w-[85%]" : "max-w-[90%]"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' 
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white" 
                : "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
              msg.role === 'user' 
                ? "bg-primary text-primary-foreground rounded-tr-none" 
                : "bg-muted text-foreground rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 max-w-[90%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-muted p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {chatMessages.length === 1 && !isTyping && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-3 font-medium">Try asking about:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  data-testid={`quick-prompt-${i}`}
                  className="text-xs px-3 py-2 rounded-full bg-primary/5 border border-primary/15 text-primary hover:bg-primary/10 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-muted/10">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type how you're feeling..."
            data-testid="input-n8n-chat"
            className="flex-1 bg-background border border-border rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground/60"
            disabled={isTyping}
          />
          <Button 
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            data-testid="button-send-n8n"
            size="icon"
            className="rounded-full h-11 w-11 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
          This is not a substitute for professional mental health care. If you're in crisis, please contact a helpline.
        </p>
      </div>
    </div>
  );
}

function getOfflineResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worried') || msg.includes('nervous')) {
    return "I understand anxiety can feel overwhelming. Here are some strategies that may help:\n\n• Try the 4-7-8 breathing technique: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds\n• Ground yourself using the 5-4-3-2-1 method: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste\n• Limit caffeine and try herbal teas like chamomile\n• Write down your worries — getting them on paper can reduce their intensity\n• Remember: anxiety is your brain's alarm system. It's trying to protect you, even if the threat isn't real.";
  }

  if (msg.includes('sad') || msg.includes('depress') || msg.includes('low') || msg.includes('down') || msg.includes('unhappy')) {
    return "I'm sorry you're feeling this way. Low moods are valid and temporary. Here are some gentle suggestions:\n\n• Allow yourself to feel without judgment — it's okay to not be okay\n• Try a small activity that usually brings comfort (a walk, music, warm drink)\n• Connect with someone you trust, even a brief text or call\n• Practice gratitude by noting 3 small things that went well today\n• Maintain a routine — structure helps stabilize mood\n• If these feelings persist, consider speaking to a mental health professional.";
  }

  if (msg.includes('stress') || msg.includes('overwhelm') || msg.includes('too much') || msg.includes('pressure')) {
    return "Feeling overwhelmed is common, especially with ADHD. Let's break it down:\n\n• Take a pause — even 2 minutes of deep breathing helps reset your nervous system\n• Pick just ONE small task to focus on right now\n• Write a 'brain dump' — list everything on your mind, then prioritize the top 3\n• Use the Pomodoro technique: 25 minutes of focus, then a 5-minute break\n• Say no to non-essential commitments today\n• Remind yourself: you don't have to do everything at once.";
  }

  if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('can\'t sleep') || msg.includes('tired')) {
    return "Sleep difficulties are very common with ADHD. Here are evidence-based tips:\n\n• Create a wind-down routine starting 1 hour before bed\n• Avoid screens 30 minutes before sleep (blue light suppresses melatonin)\n• Keep your bedroom cool, dark, and quiet\n• Try progressive muscle relaxation: tense and release each muscle group\n• Write a 'worry list' before bed to externalize racing thoughts\n• Stick to consistent wake and sleep times, even on weekends\n• Avoid caffeine after 2 PM.";
  }

  if (msg.includes('focus') || msg.includes('concentrate') || msg.includes('distract') || msg.includes('attention')) {
    return "Difficulty focusing is a core challenge with ADHD. Try these approaches:\n\n• Break tasks into 10-15 minute chunks with short breaks between\n• Use body doubling — work alongside someone (even virtually)\n• Create a distraction-free zone: noise-canceling headphones, minimal clutter\n• Use a 'parking lot' notepad to jot down stray thoughts instead of acting on them\n• Try background sounds like white noise or lo-fi music\n• Reward yourself after completing focus blocks — dopamine helps motivation.";
  }

  if (msg.includes('angry') || msg.includes('anger') || msg.includes('frustrated') || msg.includes('irritat')) {
    return "Emotional regulation can be tough with ADHD. Here are some strategies:\n\n• When anger rises, pause and count to 10 slowly\n• Name your emotion out loud: 'I'm feeling frustrated because...'\n• Physical release helps: squeeze a stress ball, do jumping jacks, or take a brisk walk\n• Use the STOP technique: Stop, Take a breath, Observe your feelings, Proceed thoughtfully\n• After calming down, journal about what triggered you\n• Remember: your feelings are valid, but reactions can be managed.";
  }

  if (msg.includes('motivation') || msg.includes('unmotivated') || msg.includes('lazy') || msg.includes('procrastinat')) {
    return "Lack of motivation with ADHD is often about dopamine, not laziness. Try these:\n\n• Start with the smallest possible step — even 2 minutes counts\n• Pair tasks with something enjoyable (music, a snack, a cozy spot)\n• Use visual progress trackers — checking things off releases dopamine\n• Set 'implementation intentions': 'After I [current habit], I will [new task]'\n• Remove friction: lay out materials the night before\n• Celebrate every small win — your brain needs those positive signals\n• Be kind to yourself: struggling with motivation doesn't mean you're failing.";
  }

  if (msg.includes('self-esteem') || msg.includes('inadequate') || msg.includes('failure') || msg.includes('worth') || msg.includes('confident')) {
    return "Many people with ADHD struggle with self-esteem due to years of challenges. Remember:\n\n• ADHD is a neurodevelopmental difference, not a character flaw\n• Keep a 'wins journal' — write down 3 things you did well each day, no matter how small\n• Challenge negative self-talk: Would you say that to a friend?\n• Focus on your strengths — ADHD often comes with creativity, energy, and unique perspectives\n• Surround yourself with people who appreciate you\n• Consider working with an ADHD coach who understands your unique brain.";
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('how are')) {
    return "Hello! I'm glad you're here. I'm your psychological wellness companion, and I'm ready to support you.\n\nYou can talk to me about:\n• Anxiety and worry management\n• Stress and feeling overwhelmed\n• Focus and concentration difficulties\n• Sleep problems\n• Mood and emotional regulation\n• Motivation and procrastination\n• Self-esteem and confidence\n\nWhat's on your mind today?";
  }

  return "Thank you for sharing that with me. Here are some general wellness suggestions:\n\n• Take a moment to check in with yourself — how is your body feeling right now?\n• Practice mindful breathing: 3 slow, deep breaths can shift your state\n• Stay hydrated and nourish yourself with regular meals\n• Move your body, even a short walk helps regulate emotions\n• Connect with someone you trust today\n• Remember that seeking support is a sign of strength, not weakness\n\nFeel free to tell me more specifically what you're going through, and I can offer more targeted strategies.";
}

export default function Chat() {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'challenges'>('chatbot');

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold font-display">Support</h2>
              <p className="text-xs text-muted-foreground">Your ADHD wellness companion</p>
            </div>
          </div>

          <div className="flex items-center bg-muted rounded-full p-1">
            <button
              onClick={() => setActiveTab('chatbot')}
              data-testid="tab-chatbot"
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all",
                activeTab === 'chatbot' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              data-testid="tab-challenges"
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all",
                activeTab === 'challenges' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ListChecks className="w-3.5 h-3.5" />
              Challenges
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'chatbot' ? (
            <motion.div
              key="chatbot"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <N8NChatbot />
            </motion.div>
          ) : (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <ProblemSupport />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
