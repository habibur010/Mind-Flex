import { useState, useRef, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw, Brain, Droplets, Moon, Coffee, Heart, Sun, Play, Smile, Frown, Meh, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import * as faceapi from "face-api.js";

interface AnalysisResult {
  condition: string;
  emoji: string;
  color: string;
  question: string;
  options: string[];
  suggestions: { text: string; icon: any }[];
  cues: string[];
}

const ANALYSES: Record<string, AnalysisResult> = {
  happy: {
    condition: "Happy",
    emoji: "😊",
    color: "from-green-500 to-emerald-600",
    question: "You look happy and cheerful! That's wonderful. Want to keep the positive energy going?",
    options: ["Yes, feeling great!", "It's a good day", "Let's do something fun"],
    cues: ["Smiling detected", "Relaxed facial muscles", "Positive expression"],
    suggestions: [
      { text: "Channel this energy into a focus task", icon: Play },
      { text: "Try a brain game to stay sharp", icon: Brain },
      { text: "Log your happy mood", icon: Heart },
      { text: "Share positive vibes in chat", icon: Sun }
    ]
  },
  sad: {
    condition: "Feeling Down",
    emoji: "😔",
    color: "from-blue-500 to-indigo-600",
    question: "You seem a little down right now. It's okay to feel this way. Would you like some support?",
    options: ["Yes, I need support", "I'm managing", "Just tired"],
    cues: ["Downturned mouth corners", "Low energy expression", "Subdued facial movement"],
    suggestions: [
      { text: "Talk to our AI companion", icon: Brain },
      { text: "Try a calming breathing exercise", icon: Heart },
      { text: "Listen to relaxation music", icon: Moon },
      { text: "Take a gentle break", icon: Coffee }
    ]
  },
  angry: {
    condition: "Tense",
    emoji: "😤",
    color: "from-red-500 to-rose-600",
    question: "You seem a bit tense or frustrated. Would you like to try something calming?",
    options: ["Yes, help me relax", "A little frustrated", "I'm okay"],
    cues: ["Furrowed brows detected", "Tight jaw muscles", "Intense expression"],
    suggestions: [
      { text: "Guided breathing animation", icon: Heart },
      { text: "Try a quick yoga stretch", icon: Sun },
      { text: "Play a calming game", icon: Play },
      { text: "Step away for 5 minutes", icon: Coffee }
    ]
  },
  fearful: {
    condition: "Anxious",
    emoji: "😰",
    color: "from-purple-500 to-violet-600",
    question: "You look a little anxious or worried. Remember, it's okay to take things one step at a time.",
    options: ["Feeling anxious", "A bit overwhelmed", "I'll be okay"],
    cues: ["Wide eyes detected", "Raised eyebrows", "Tense expression"],
    suggestions: [
      { text: "4-7-8 breathing exercise", icon: Heart },
      { text: "Talk about it with AI chat", icon: Brain },
      { text: "Listen to calming music", icon: Moon },
      { text: "Reduce your task load today", icon: Coffee }
    ]
  },
  disgusted: {
    condition: "Uncomfortable",
    emoji: "😣",
    color: "from-amber-500 to-yellow-600",
    question: "Something seems to be bothering you. Want to shift your focus to something more pleasant?",
    options: ["Yes, distract me", "I'm fine", "Need a break"],
    cues: ["Wrinkled nose detected", "Squinting", "Discomfort expression"],
    suggestions: [
      { text: "Play a fun brain game", icon: Play },
      { text: "Watch some yoga content", icon: Sun },
      { text: "Drink some water", icon: Droplets },
      { text: "Take a short walk", icon: Coffee }
    ]
  },
  surprised: {
    condition: "Alert",
    emoji: "😮",
    color: "from-cyan-500 to-teal-600",
    question: "You look alert and attentive! Great time to tackle something productive.",
    options: ["Ready to focus", "Feeling energized", "Let's go!"],
    cues: ["Wide eyes detected", "Raised eyebrows", "Alert expression"],
    suggestions: [
      { text: "Start a focus timer", icon: Play },
      { text: "Tackle your top priority task", icon: Sun },
      { text: "Try a challenging brain game", icon: Brain },
      { text: "Set new goals", icon: Heart }
    ]
  },
  neutral: {
    condition: "Steady",
    emoji: "😐",
    color: "from-slate-500 to-gray-600",
    question: "You seem calm and steady right now. Would you like to continue or try something new?",
    options: ["Continue tasks", "Explore tips", "Try a game"],
    cues: ["Neutral expression", "Calm posture", "Normal blinking"],
    suggestions: [
      { text: "Set a focus timer", icon: Play },
      { text: "Start a small task", icon: Sun },
      { text: "Drink some water", icon: Droplets },
      { text: "Check your mood log", icon: Heart }
    ]
  },
  tired: {
    condition: "Fatigue",
    emoji: "😴",
    color: "from-orange-500 to-amber-600",
    question: "You seem a bit tired right now. Did you sleep well recently?",
    options: ["I didn't sleep much", "I slept okay", "Not sure"],
    cues: ["Frequent blinking", "Droopy eyes", "Low energy expression"],
    suggestions: [
      { text: "Take a short break (5-10 mins)", icon: Coffee },
      { text: "Drink water", icon: Droplets },
      { text: "Try a 1-minute breathing exercise", icon: Heart },
      { text: "Avoid heavy tasks for now", icon: Moon }
    ]
  }
};

function getConditionIcon(condition: string) {
  switch (condition) {
    case "Happy": return Smile;
    case "Feeling Down": return Frown;
    case "Tense": return AlertTriangle;
    case "Anxious": return AlertTriangle;
    case "Alert": return Sun;
    default: return Meh;
  }
}

export default function FaceAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number> | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const modelsLoadedRef = useRef(false);

  const loadModels = useCallback(async (): Promise<boolean> => {
    if (modelsLoadedRef.current) return true;
    if (modelsLoading) return false;
    setModelsLoading(true);
    setModelError(null);
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      modelsLoadedRef.current = true;
      setModelsLoaded(true);
      return true;
    } catch (err) {
      console.error("Failed to load face detection models:", err);
      setModelError("Could not load face detection models. Please check your connection and try again.");
      return false;
    } finally {
      setModelsLoading(false);
    }
  }, [modelsLoading]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const analyzeExpression = async (): Promise<{ expression: string; scores: Record<string, number> } | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0);

    const detection = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 }))
      .withFaceExpressions();

    if (!detection) return null;

    const expressions = detection.expressions;
    const scores: Record<string, number> = {
      happy: expressions.happy || 0,
      sad: expressions.sad || 0,
      angry: expressions.angry || 0,
      fearful: expressions.fearful || 0,
      disgusted: expressions.disgusted || 0,
      surprised: expressions.surprised || 0,
      neutral: expressions.neutral || 0,
    };

    let topExpression = "neutral";
    let topScore = 0;
    for (const [expr, score] of Object.entries(scores)) {
      if (score > topScore) {
        topScore = score;
        topExpression = expr;
      }
    }

    if (topExpression === "neutral" && topScore > 0.6 && scores.sad > 0.15) {
      topExpression = "tired";
    }

    return { expression: topExpression, scores };
  };

  const startAnalysis = async () => {
    const ready = await loadModels();
    if (!ready) return;

    stopCamera();
    setAnalyzing(true);
    setResult(null);
    setConfirmed(false);
    setConfidenceScores(null);
    setScanProgress(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play();
            resolve();
          };
        });
      }
      setCameraActive(true);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const readings: Record<string, number[]> = {
        happy: [], sad: [], angry: [], fearful: [],
        disgusted: [], surprised: [], neutral: []
      };

      const totalSamples = 8;
      for (let i = 0; i < totalSamples; i++) {
        setScanProgress(Math.round(((i + 1) / totalSamples) * 100));
        const result = await analyzeExpression();
        if (result) {
          for (const [key, val] of Object.entries(result.scores)) {
            readings[key].push(val);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      const totalDetections = readings.happy.length;
      if (totalDetections === 0) {
        setAnalyzing(false);
        stopCamera();
        setModelError("No face detected. Please make sure your face is clearly visible, well-lit, and centered in the camera, then try again.");
        return;
      }

      const avgScores: Record<string, number> = {};
      for (const [key, vals] of Object.entries(readings)) {
        avgScores[key] = vals.length > 0
          ? vals.reduce((a, b) => a + b, 0) / vals.length
          : 0;
      }

      let topExpression = "neutral";
      let topScore = 0;
      for (const [expr, score] of Object.entries(avgScores)) {
        if (score > topScore) {
          topScore = score;
          topExpression = expr;
        }
      }

      if (topExpression === "neutral" && topScore > 0.5 && avgScores.sad > 0.12) {
        topExpression = "tired";
      }

      const analysisResult = ANALYSES[topExpression] || ANALYSES.neutral;
      setResult(analysisResult);
      setConfidenceScores(avgScores);
      setAnalyzing(false);
      stopCamera();
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalyzing(false);
      stopCamera();
      setModelError("Could not access camera. Please allow camera permissions and try again.");
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const topExpressions = confidenceScores
    ? Object.entries(confidenceScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
    : [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-primary" data-testid="text-page-title">Mind Scan</h1>
        <p className="text-muted-foreground mt-2">Real-time facial expression analysis for personalized wellness support.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden border-none bg-card shadow-xl rounded-[2rem]">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Camera className="w-5 h-5" />
              Mind Scan AI
              {modelsLoaded && (
                <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full" data-testid="status-models-loaded">
                  AI Ready
                </span>
              )}
              {modelsLoading && (
                <span className="ml-auto text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Loading AI...
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-inner group">
              <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`} data-testid="video-webcam" />
              <canvas ref={canvasRef} className="hidden" />
              
              {analyzing && cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 bg-slate-900/40">
                  <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                  <p className="text-2xl font-bold animate-pulse font-display">Analyzing your expression...</p>
                  <p className="text-sm opacity-60 mt-2">Detecting facial cues ({scanProgress}%)</p>
                  <div className="w-48 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {!cameraActive && !result && !analyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Camera className="w-10 h-10 opacity-40" />
                  </div>
                  <p className="text-lg font-medium">Ready for your daily scan</p>
                  <p className="text-sm opacity-60 max-w-xs text-center mt-2">
                    {modelError 
                      ? modelError 
                      : "AI-powered expression detection. Your data stays private and never leaves your device."}
                  </p>
                </div>
              )}

              {!cameraActive && result && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                  <div className="text-6xl mb-4">{result.emoji}</div>
                  <p className="text-lg font-medium text-primary">Scan Complete</p>
                  <p className="text-sm opacity-60 mt-1">Detected: <span className="font-bold text-white">{result.condition}</span></p>
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

            <div className="flex justify-center gap-4">
              {!analyzing && !result && (
                <Button 
                  onClick={startAnalysis} 
                  size="lg" 
                  className="rounded-full px-12 h-14 text-lg font-bold gap-3 shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
                  disabled={modelsLoading}
                  data-testid="button-begin-scan"
                >
                  {modelsLoading ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Loading AI...</>
                  ) : (
                    <><Camera className="w-6 h-6" /> Begin Mind Scan</>
                  )}
                </Button>
              )}
              {result && !analyzing && (
                <Button 
                  onClick={startAnalysis} 
                  variant="outline" 
                  className="rounded-full h-12 px-8 gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                  data-testid="button-new-scan"
                >
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
                  data-testid="section-observation-report"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{result.emoji}</span>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary/60 bg-primary/5 px-3 py-1 rounded-full">Observation Report</span>
                        <h3 className="text-xl font-bold font-display mt-1" data-testid="text-detected-condition">{result.condition}</h3>
                      </div>
                    </div>
                    <p className="text-lg leading-relaxed text-muted-foreground">{result.question}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {result.cues.map(cue => (
                        <span key={cue} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500">
                          {cue}
                        </span>
                      ))}
                    </div>
                  </div>

                  {confidenceScores && topExpressions.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                      <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-3">Detection Confidence</p>
                      <div className="space-y-2">
                        {topExpressions.map(([expr, score]) => (
                          <div key={expr} className="flex items-center gap-3">
                            <span className="text-xs font-bold w-20 capitalize">{expr}</span>
                            <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${Math.round(score * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-500 w-10 text-right" data-testid={`text-confidence-${expr}`}>
                              {Math.round(score * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!confirmed ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {result.options.map(opt => (
                        <Button 
                          key={opt} 
                          variant="secondary" 
                          className="rounded-2xl h-16 text-lg font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => setConfirmed(true)}
                          data-testid={`button-option-${opt.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
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

          {result && confidenceScores && (
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-primary" />
                  Expression Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {Object.entries(confidenceScores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([expr, score]) => {
                    const emoji = ANALYSES[expr]?.emoji || "😐";
                    return (
                      <div key={expr} className="flex items-center gap-2">
                        <span className="text-lg">{emoji}</span>
                        <span className="text-xs font-bold w-16 capitalize">{expr}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary/60 rounded-full"
                            style={{ width: `${Math.round(score * 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{Math.round(score * 100)}%</span>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          )}
          
          <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
               <Brain className="w-5 h-5 text-primary" />
               <h3 className="font-bold">Privacy First</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All face detection runs entirely in your browser using on-device AI. No images or recordings are ever sent to a server or stored anywhere. Your privacy is fully protected.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
