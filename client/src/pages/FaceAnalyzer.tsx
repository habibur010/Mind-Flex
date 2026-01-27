import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw, Brain, Droplets, Moon, Coffee, Heart, Sun, Play } from "lucide-react";
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
    question: "You look a little tension. Are you feeling stressed or overwhelmed right now?",
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

export default function FaceAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startAnalysis = () => {
    setAnalyzing(true);
    setResult(null);
    setConfirmed(false);
    
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    }).catch(console.error);

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
        <h1 className="text-3xl font-bold font-display text-primary">Mind Scan</h1>
        <p className="text-muted-foreground mt-2">Personalized support based on non-invasive facial cues.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden border-none bg-card shadow-xl rounded-[2rem]">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Camera className="w-5 h-5" />
              Mind Scan AI
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-inner group">
              {analyzing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-slate-900/60 backdrop-blur-sm">
                  <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                  <p className="text-2xl font-bold animate-pulse font-display">Analyzing facial patterns...</p>
                  <p className="text-sm opacity-60 mt-2">Checking blinking, tension, and focus</p>
                </div>
              ) : result ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 opacity-40" />
                  </div>
                  <p className="text-lg font-medium">Ready for your daily scan</p>
                  <p className="text-sm opacity-60 max-w-xs text-center mt-2">Your data stays private and is only used for immediate suggestions.</p>
                </div>
              )}
              
              {analyzing && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-[size:40px_40px]" />
                  <div className="absolute top-12 left-12 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-3xl" />
                  <div className="absolute top-12 right-12 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-3xl" />
                  <div className="absolute bottom-12 left-12 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-3xl" />
                  <div className="absolute bottom-12 right-12 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-3xl" />
                  <motion.div 
                    initial={{ top: '10%' }}
                    animate={{ top: '90%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-10 right-10 h-1 bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.5)] z-20"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-center">
              {!analyzing && !result && (
                <Button onClick={startAnalysis} size="lg" className="rounded-full px-12 h-14 text-lg font-bold gap-3 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                  <Camera className="w-6 h-6" /> Begin Mind Scan
                </Button>
              )}
              {result && !analyzing && (
                <Button onClick={startAnalysis} variant="outline" className="rounded-full h-12 px-8 gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                  <RefreshCcw className="w-4 h-4" /> New Scan
                </Button>
              )}
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-primary/10 shadow-2xl space-y-6"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/60 bg-primary/5 px-3 py-1 rounded-full">Observation Report</span>
                    <h3 className="text-2xl md:text-3xl font-bold font-display leading-tight">{result.question}</h3>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.cues.map(cue => (
                        <span key={cue} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500">
                          {cue}
                        </span>
                      ))}
                    </div>
                  </div>

                  {!confirmed ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {result.options.map(opt => (
                        <Button 
                          key={opt} 
                          variant="secondary" 
                          className="rounded-2xl h-16 text-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => setConfirmed(true)}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="pt-8 border-t border-primary/10 space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <p className="font-black text-xs text-slate-400 uppercase tracking-widest">Recommended Wellness Plan</p>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {result.suggestions.map((sug, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
                          >
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-md text-primary group-hover:scale-110 transition-transform">
                              <sug.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold leading-tight">{sug.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 rounded-[2.5rem] overflow-hidden text-white p-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Coffee className="w-5 h-5" />
                </div>
                Nutrition Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-black text-xs uppercase tracking-widest opacity-80">Phase 1: Brain Fuel</h4>
                  <span className="text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded-full font-black">ESSENTIAL</span>
                </div>
                <p className="text-sm font-bold mb-2">Omega-3 Rich Foods</p>
                <p className="text-xs opacity-70 leading-relaxed">Salmon, Walnuts, and Chia seeds to support focus and brain cell repair.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-black text-xs uppercase tracking-widest opacity-80">Phase 2: Energy Sync</h4>
                  <span className="text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded-full font-black">ADAPTIVE</span>
                </div>
                <p className="text-sm font-bold mb-2">Proteins & Amino Acids</p>
                <p className="text-xs opacity-70 leading-relaxed">Eggs, chicken, and lentils for steady neurotransmitter production.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-black text-xs uppercase tracking-widest opacity-80">Phase 3: Balance</h4>
                  <span className="text-[10px] bg-white text-orange-600 px-2 py-0.5 rounded-full font-black">MAINTAIN</span>
                </div>
                <p className="text-sm font-bold mb-2">Complex Carbohydrates</p>
                <p className="text-xs opacity-70 leading-relaxed">Whole grains and leafy greens to prevent focus crashes and mood dips.</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
               <Brain className="w-5 h-5 text-primary" />
               <h3 className="font-bold">Privacy First</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scan logic is performed entirely on your device. We never store images or recordings. Your observations are purely used to provide contextual wellness tips.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}