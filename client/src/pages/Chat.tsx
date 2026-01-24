import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
// Assuming chat hooks exist from previous integrations, mocking for pure frontend if not
// Realistically, we'd use the provided chat integration hooks here.

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { role: 'assistant', content: `Hi ${user?.firstName || 'there'}! I'm here to support you. Need help organizing your thoughts or just want to chat?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Simulate API call delay for demo purposes if backend not fully wired
      // Replace with actual fetch to /api/conversations/:id/messages
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I hear you. Breaking things down into smaller steps often helps. Would you like to try listing just one small thing you can do in the next 5 minutes?" 
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold">MindFlex Support</h2>
            <p className="text-xs text-muted-foreground">Always here for you</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-3 max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
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
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-75" />
                <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isLoading}
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
