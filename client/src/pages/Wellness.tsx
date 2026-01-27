import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, Camera, RefreshCcw, Brain, Droplets, Moon, Coffee, Heart, Sun } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisResult {
  condition: string;
  question: string;
  options: string[];
  suggestions: { text: string; icon: any }[];
  cues: string[];
}

const ANALYSES: Record<string, AnalysisResult> = {
  tired: {
    condition: "Fatigue",
    question: "You seem a bit tired right now. Did you sleep well recently?",
    options: ["I didn't sleep much", "I slept okay", "Not sure"],
    cues: ["Frequent blinking", "Long eye closure", "Yawning"],
    suggestions: [
      { text: "Take a short break (5-10 mins)", icon: Coffee },
      { text: "Drink water", icon: Droplets },
      { text: "Try a 1-minute breathing exercise", icon: Heart },
      { text: "Avoid heavy tasks for now", icon: Moon }
    ]
  },
  stressed: {
    condition: "Stress",
    question: "You look a little tense. Are you feeling stressed or overwhelmed right now?",
    options: ["Yes, very stressed", "A little", "Not really"],
    cues: ["Tight facial muscles", "Furrowed brows", "Rigid posture"],
    suggestions: [
      { text: "Guided breathing animation", icon: Heart },
      { text: "Want to talk? (AI Chat)", icon: Brain },
      { text: "Short calming activity", icon: Moon },
      { text: "It's okay to pause", icon: Coffee }
    ]
  },
  exhausted: {
    condition: "Exhaustion",
    question: "It seems like you might be mentally exhausted. Do you feel drained right now?",
    options: ["Yes", "Maybe", "No"],
    cues: ["Blank stare", "Low facial movement", "Lack of engagement"],
    suggestions: [
      { text: "Step away from screen briefly", icon: Sun },
      { text: "Do a low-effort focus game", icon: Play },
      { text: "Reduce task load", icon: Brain },
      { text: "Rest without guilt", icon: Moon }
    ]
  },
  okay: {
    condition: "Steady",
    question: "You seem okay right now. Would you like to continue or try something else?",
    options: ["Continue tasks", "Explore tips", "Try a game"],
    cues: ["Normal blinking", "Calm posture"],
    suggestions: [
      { text: "Set a focus timer", icon: Play },
      { text: "Start a small task", icon: Sun },
      { text: "Drink some water", icon: Droplets }
    ]
  }
};

export default function Wellness() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startAnalysis = () => {
    setAnalyzing(true);
    setResult(null);
    setConfirmed(false);
    
    // Simulate camera access
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }).catch(console.error);

    // Simulate analysis delay
    setTimeout(() => {
      const keys = Object.keys(ANALYSES);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setResult(ANALYSES[randomKey]);
      setAnalyzing(false);
    }, 3000);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Wellness Studio</h1>
        <p className="text-muted-foreground mt-2">Personalized support based on how you feel.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Face Analyzer */}
        <Card className="lg:col-span-2 overflow-hidden border-none bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Mind Scan (Face Analyzer)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group">
              {analyzing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                  <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xl font-bold animate-pulse">Scanning facial cues...</p>
                  <div className="mt-4 flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              ) : result ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-40" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Camera className="w-16 h-16 mb-4 opacity-20" />
                  <p>Start a scan to check your focus and energy levels</p>
                </div>
              )}
              
              {/* Scan overlay */}
              {analyzing && (
                <div className="absolute inset-0 border-2 border-primary/30 pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {!analyzing && !result && (
                <Button onClick={startAnalysis} size="lg" className="rounded-full px-8 gap-2">
                  <Camera className="w-5 h-5" /> Start Mind Scan
                </Button>
              )}
              {result && !analyzing && (
                <Button onClick={startAnalysis} variant="outline" className="rounded-full gap-2">
                  <RefreshCcw className="w-4 h-4" /> Scan Again
                </Button>
              )}
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card p-6 rounded-2xl border shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{result.question}</h3>
                      <div className="flex gap-2 mt-2">
                        {result.cues.map(cue => (
                          <span key={cue} className="text-[10px] uppercase tracking-wider font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                            {cue}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!confirmed ? (
                    <div className="flex flex-wrap gap-3">
                      {result.options.map(opt => (
                        <Button 
                          key={opt} 
                          variant="secondary" 
                          className="rounded-xl"
                          onClick={() => setConfirmed(true)}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-4 border-t space-y-4">
                      <p className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Recommended Actions:</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {result.suggestions.map((sug, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10 group hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <sug.icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{sug.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Nutrition Guide */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-orange-600" />
                ADHD Nutrition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-white/80 dark:bg-card/50 rounded-xl border border-orange-100 dark:border-orange-900/30">
                  <h4 className="font-bold text-sm text-orange-700 dark:text-orange-400 mb-1">Omega-3 Rich</h4>
                  <p className="text-xs text-muted-foreground">Supports brain function. Try salmon, walnuts, or chia seeds.</p>
                </div>
                <div className="p-3 bg-white/80 dark:bg-card/50 rounded-xl border border-orange-100 dark:border-orange-900/30">
                  <h4 className="font-bold text-sm text-orange-700 dark:text-orange-400 mb-1">High Protein</h4>
                  <p className="text-xs text-muted-foreground">Eggs, chicken, beans. Great for steady focus.</p>
                </div>
                <div className="p-3 bg-white/80 dark:bg-card/50 rounded-xl border border-orange-100 dark:border-orange-900/30">
                  <h4 className="font-bold text-sm text-orange-700 dark:text-orange-400 mb-1">Complex Carbs</h4>
                  <p className="text-xs text-muted-foreground">Whole grains to avoid energy crashes.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Yoga flows from before */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold px-2">Focus Flows</h2>
            {[
              { title: "Morning Stretch", duration: "5 min", image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=400" },
              { title: "Desk Relief", duration: "3 min", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400" }
            ].map((item, i) => (
              <div key={i} className="group bg-card p-4 rounded-2xl border border-border flex gap-4 items-center hover:shadow-md transition-all cursor-pointer">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.duration}</p>
                </div>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                  <Play className="w-4 h-4 fill-current" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
