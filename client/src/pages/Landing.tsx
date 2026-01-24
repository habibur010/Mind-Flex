import { Link } from "wouter";
import { ArrowRight, Brain, Zap, Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="p-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold font-display text-foreground">MindFlex</span>
        </div>
        <a href="/api/login" className="px-6 py-2.5 rounded-full bg-white text-foreground font-semibold shadow-sm hover:shadow-md transition-all">
          Sign In
        </a>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold font-display text-foreground leading-[1.1]">
              Master your mind,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                find your focus.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              A playful, supportive space designed for ADHD minds. Track tasks, play focus games, and find your daily rhythm.
            </p>
            <div className="flex gap-4">
              <a href="/api/login" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            {/* Unsplash abstract art */}
            {/* abstract fluid art blue purple */}
            <img 
              src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1000"
              alt="MindFlex Abstract Art"
              className="rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700"
            />
            
            {/* Floating cards */}
            <div className="absolute -left-12 top-20 bg-white p-6 rounded-2xl shadow-xl animate-float">
              <Zap className="w-8 h-8 text-yellow-500 mb-2" />
              <p className="font-bold">Focus Streak</p>
              <p className="text-2xl font-display text-primary">5 Days!</p>
            </div>

            <div className="absolute -right-8 bottom-20 bg-white p-6 rounded-2xl shadow-xl animate-float" style={{ animationDelay: '2s' }}>
              <Heart className="w-8 h-8 text-red-500 mb-2" />
              <p className="font-bold">Mood</p>
              <p className="text-2xl font-display text-green-600">Feeling Great</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-muted-foreground text-sm">
        <p>© 2024 MindFlex. Designed for neurodiverse minds.</p>
      </footer>
    </div>
  );
}
