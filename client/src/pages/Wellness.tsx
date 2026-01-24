import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Wellness() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Wellness Studio</h1>
        <p className="text-muted-foreground mt-2">Take a moment to breathe and reset.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Breathing Exercise */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold mb-8">Box Breathing</h2>
            
            <div className="w-48 h-48 rounded-full border-4 border-white/30 flex items-center justify-center mb-8 relative">
              <div className="w-40 h-40 bg-white/20 rounded-full animate-breathe backdrop-blur-md" />
              <span className="absolute text-xl font-bold tracking-widest uppercase">Breathe</span>
            </div>
            
            <p className="text-white/80 mb-6 max-w-xs mx-auto">Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s.</p>
            <Button className="bg-white text-teal-600 hover:bg-white/90 rounded-full px-8 font-bold">
              Start Session
            </Button>
          </div>
        </div>

        {/* Yoga List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold px-2">Quick Yoga Flows</h2>
          {[
            { title: "Morning Stretch", duration: "5 min", image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=400" },
            { title: "Desk Relief", duration: "3 min", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400" },
            { title: "Sleep Prep", duration: "10 min", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400" }
          ].map((item, i) => (
            <div key={i} className="group bg-card p-4 rounded-2xl border border-border flex gap-4 items-center hover:shadow-md transition-all cursor-pointer">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                {/* Unsplash images for yoga poses */}
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.duration} • Beginner Friendly</p>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Play className="w-5 h-5 fill-current" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
