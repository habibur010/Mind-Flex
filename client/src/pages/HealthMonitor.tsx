import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Heart, Activity, Moon, Wind, Thermometer, Brain, TrendingUp, TrendingDown, Minus, Plus, Save, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info, BarChart3, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface HealthEntry {
  id: string;
  date: string;
  hrv: number;
  restingHeartRate: number;
  sleepHours: number;
  sleepQuality: number;
  deepSleepPercent: number;
  remSleepPercent: number;
  activityMinutes: number;
  steps: number;
  stressLevel: number;
  respiratoryRate: number;
  skinTemperature: number;
  notes: string;
}

const STORAGE_KEY = "mindflex_health_data";

function getStoredData(): HealthEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveData(entries: HealthEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getInsightLevel(value: number, low: number, high: number): "good" | "warning" | "alert" {
  if (value >= low && value <= high) return "good";
  if (value < low * 0.8 || value > high * 1.2) return "alert";
  return "warning";
}

function InsightBadge({ level }: { level: "good" | "warning" | "alert" }) {
  if (level === "good") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (level === "warning") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  return <AlertTriangle className="w-4 h-4 text-red-500" />;
}

function generateInsights(entry: HealthEntry) {
  const insights: { category: string; message: string; level: "good" | "warning" | "alert"; icon: any }[] = [];

  if (entry.hrv > 0) {
    if (entry.hrv < 20) {
      insights.push({ category: "HRV", message: "Your HRV is very low. This often indicates high stress or poor recovery. Consider relaxation techniques like deep breathing or meditation.", level: "alert", icon: Heart });
    } else if (entry.hrv < 40) {
      insights.push({ category: "HRV", message: "Your HRV is below average. Try to reduce stress, get better sleep, and stay hydrated.", level: "warning", icon: Heart });
    } else if (entry.hrv <= 100) {
      insights.push({ category: "HRV", message: "Your HRV is in a healthy range! This suggests good nervous system balance and resilience.", level: "good", icon: Heart });
    } else {
      insights.push({ category: "HRV", message: "Excellent HRV! Your body is showing strong recovery and stress resilience.", level: "good", icon: Heart });
    }
  }

  if (entry.restingHeartRate > 0) {
    if (entry.restingHeartRate > 100) {
      insights.push({ category: "Resting Heart Rate", message: "Your resting heart rate is elevated. This can indicate chronic stress, poor sleep, or dehydration. Consider consulting a doctor if this persists.", level: "alert", icon: Activity });
    } else if (entry.restingHeartRate > 80) {
      insights.push({ category: "Resting Heart Rate", message: "Your resting heart rate is slightly high. Regular exercise and stress management can help lower it.", level: "warning", icon: Activity });
    } else if (entry.restingHeartRate >= 50) {
      insights.push({ category: "Resting Heart Rate", message: "Your resting heart rate is in a healthy range. Great cardiovascular fitness!", level: "good", icon: Activity });
    } else {
      insights.push({ category: "Resting Heart Rate", message: "Your resting heart rate is very low. This is common in athletes but consult a doctor if you feel dizzy or fatigued.", level: "warning", icon: Activity });
    }
  }

  if (entry.sleepHours > 0) {
    if (entry.sleepHours < 5) {
      insights.push({ category: "Sleep Duration", message: "You're getting very little sleep. Sleep deprivation is strongly linked to anxiety, depression, and poor focus. Aim for 7-9 hours.", level: "alert", icon: Moon });
    } else if (entry.sleepHours < 7) {
      insights.push({ category: "Sleep Duration", message: "You're sleeping less than recommended. Try to get at least 7 hours for better mood and cognitive function.", level: "warning", icon: Moon });
    } else if (entry.sleepHours <= 9) {
      insights.push({ category: "Sleep Duration", message: "Great sleep duration! 7-9 hours is ideal for mental health and recovery.", level: "good", icon: Moon });
    } else {
      insights.push({ category: "Sleep Duration", message: "You may be oversleeping. While rest is important, excessive sleep can indicate low energy or depression.", level: "warning", icon: Moon });
    }
  }

  if (entry.deepSleepPercent > 0 || entry.remSleepPercent > 0) {
    if (entry.deepSleepPercent < 10) {
      insights.push({ category: "Deep Sleep", message: "Your deep sleep percentage is low. Deep sleep is crucial for physical recovery and memory consolidation. Avoid caffeine late in the day.", level: "warning", icon: Moon });
    } else if (entry.deepSleepPercent >= 15 && entry.deepSleepPercent <= 25) {
      insights.push({ category: "Deep Sleep", message: "Excellent deep sleep! Your body is recovering well during the night.", level: "good", icon: Moon });
    }
    if (entry.remSleepPercent < 15) {
      insights.push({ category: "REM Sleep", message: "Your REM sleep is below average. REM is essential for emotional processing and learning. A consistent sleep schedule can help.", level: "warning", icon: Brain });
    } else if (entry.remSleepPercent >= 20 && entry.remSleepPercent <= 30) {
      insights.push({ category: "REM Sleep", message: "Healthy REM sleep levels! This supports emotional regulation and creativity.", level: "good", icon: Brain });
    }
  }

  if (entry.activityMinutes > 0) {
    if (entry.activityMinutes < 15) {
      insights.push({ category: "Activity", message: "Very low activity today. Even a short 15-minute walk can boost mood and reduce anxiety.", level: "alert", icon: Flame });
    } else if (entry.activityMinutes < 30) {
      insights.push({ category: "Activity", message: "Some activity is better than none! Try to reach 30 minutes for optimal mental health benefits.", level: "warning", icon: Flame });
    } else {
      insights.push({ category: "Activity", message: "Great activity level! Regular movement helps manage ADHD symptoms and boosts dopamine.", level: "good", icon: Flame });
    }
  }

  if (entry.stressLevel > 0) {
    if (entry.stressLevel >= 8) {
      insights.push({ category: "Stress", message: "Your stress level is very high. Consider breathing exercises, a break, or talking to someone. Chronic high stress affects both mental and physical health.", level: "alert", icon: Brain });
    } else if (entry.stressLevel >= 5) {
      insights.push({ category: "Stress", message: "Moderate stress detected. Try mindfulness exercises or a short walk to help bring it down.", level: "warning", icon: Brain });
    } else {
      insights.push({ category: "Stress", message: "Low stress — you're in a calm state. Keep up the self-care routines that are working for you!", level: "good", icon: Brain });
    }
  }

  if (entry.respiratoryRate > 0) {
    if (entry.respiratoryRate > 20) {
      insights.push({ category: "Breathing", message: "Your respiratory rate is elevated. This can be linked to anxiety or stress. Try slow, deep breathing exercises.", level: "warning", icon: Wind });
    } else if (entry.respiratoryRate >= 12 && entry.respiratoryRate <= 20) {
      insights.push({ category: "Breathing", message: "Your breathing rate is normal. Steady breathing supports a calm nervous system.", level: "good", icon: Wind });
    } else {
      insights.push({ category: "Breathing", message: "Your respiratory rate is unusually low. This is typically fine at rest but monitor for any discomfort.", level: "warning", icon: Wind });
    }
  }

  if (entry.skinTemperature > 0) {
    if (entry.skinTemperature < 35) {
      insights.push({ category: "Skin Temperature", message: "Below normal skin temperature may indicate poor circulation or stress response. Stay warm and monitor.", level: "warning", icon: Thermometer });
    } else if (entry.skinTemperature >= 35 && entry.skinTemperature <= 37.5) {
      insights.push({ category: "Skin Temperature", message: "Skin temperature is in the normal range, indicating healthy circadian rhythm.", level: "good", icon: Thermometer });
    } else {
      insights.push({ category: "Skin Temperature", message: "Elevated skin temperature could indicate inflammation, fever, or disrupted circadian rhythm. Monitor closely.", level: "alert", icon: Thermometer });
    }
  }

  return insights;
}

function MetricInput({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step, 
  unit, 
  icon: Icon, 
  color,
  description 
}: { 
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: any;
  color: string;
  description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2.5 rounded-xl", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">{label}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
          data-testid={`btn-decrease-${label.toLowerCase().replace(/\s/g, '-')}`}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          <input
            type="number"
            value={value || ""}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v >= min && v <= max) onChange(v);
              if (e.target.value === "") onChange(0);
            }}
            data-testid={`input-${label.toLowerCase().replace(/\s/g, '-')}`}
            className="w-full text-center text-2xl font-bold bg-transparent border-none outline-none text-foreground"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))}
          data-testid={`btn-increase-${label.toLowerCase().replace(/\s/g, '-')}`}
          className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StressSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const getColor = (v: number) => {
    if (v === 0) return "bg-muted";
    if (v <= 3) return "bg-emerald-500";
    if (v <= 6) return "bg-amber-500";
    return "bg-red-500";
  };
  const getLabel = (v: number) => {
    if (v === 0) return "Not Set";
    if (v <= 3) return "Low";
    if (v <= 6) return "Moderate";
    return "High";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-purple-500">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">Stress Level</h4>
          <p className="text-xs text-muted-foreground">Rate your perceived stress (0 = skip, 1-10)</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-3xl font-bold text-foreground">{value === 0 ? "—" : value}</span>
          <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", value === 0 ? "bg-muted text-muted-foreground" : "text-white", getColor(value))}>
            {getLabel(value)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          data-testid="slider-stress-level"
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-purple-500"
          style={{
            background: `linear-gradient(to right, #d1d5db 0%, #10b981 10%, #f59e0b 50%, #ef4444 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Skip</span>
          <span>Calm</span>
          <span>Stressed</span>
        </div>
      </div>
    </div>
  );
}

function SleepQualityInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-emerald-400", "bg-emerald-600"];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-indigo-500">
          <Moon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-foreground">Sleep Quality</h4>
          <p className="text-xs text-muted-foreground">How well did you sleep?</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => onChange(rating)}
            data-testid={`btn-sleep-quality-${rating}`}
            className={cn(
              "flex-1 py-3 rounded-xl text-xs font-semibold transition-all",
              value === rating
                ? cn(colors[rating], "text-white shadow-md scale-105")
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {labels[rating]}
          </button>
        ))}
      </div>
    </div>
  );
}

function TrendChart({ data, dataKey, label, color }: { data: HealthEntry[]; dataKey: keyof HealthEntry; label: string; color: string }) {
  const chartData = data.slice(-7).map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: entry[dataKey] as number,
  })).filter(d => d.value > 0);

  if (chartData.length < 2) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5 text-center">
        <p className="text-sm text-muted-foreground">Need at least 2 entries to show {label} trend</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h4 className="font-semibold text-sm text-foreground mb-4">{label} (Last 7 entries)</h4>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px"
            }}
          />
          <Area type="monotone" dataKey="value" stroke={color} fill={`url(#gradient-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function HealthMonitor() {
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [showForm, setShowForm] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const today = new Date().toISOString().split('T')[0];
  const selectedEntry = entries.find(e => e.date === selectedDate);

  const emptyForm: Omit<HealthEntry, 'id' | 'date'> = {
    hrv: 0,
    restingHeartRate: 0,
    sleepHours: 0,
    sleepQuality: 0,
    deepSleepPercent: 0,
    remSleepPercent: 0,
    activityMinutes: 0,
    steps: 0,
    stressLevel: 0,
    respiratoryRate: 0,
    skinTemperature: 0,
    notes: "",
  };

  const [form, setForm] = useState<Omit<HealthEntry, 'id' | 'date'>>(emptyForm);

  useEffect(() => {
    setEntries(getStoredData());
  }, []);

  useEffect(() => {
    if (selectedEntry) {
      setForm({
        hrv: selectedEntry.hrv,
        restingHeartRate: selectedEntry.restingHeartRate,
        sleepHours: selectedEntry.sleepHours,
        sleepQuality: selectedEntry.sleepQuality,
        deepSleepPercent: selectedEntry.deepSleepPercent,
        remSleepPercent: selectedEntry.remSleepPercent,
        activityMinutes: selectedEntry.activityMinutes,
        steps: selectedEntry.steps,
        stressLevel: selectedEntry.stressLevel,
        respiratoryRate: selectedEntry.respiratoryRate,
        skinTemperature: selectedEntry.skinTemperature,
        notes: selectedEntry.notes,
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedEntry?.id, selectedDate]);

  const handleSave = () => {
    const entry: HealthEntry = {
      id: selectedEntry?.id || crypto.randomUUID(),
      date: selectedDate,
      ...form,
    };

    let updated: HealthEntry[];
    if (selectedEntry) {
      updated = entries.map(e => e.date === selectedDate ? entry : e);
    } else {
      updated = [...entries, entry];
    }

    updated.sort((a, b) => a.date.localeCompare(b.date));
    saveData(updated);
    setEntries(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currentInsights = generateInsights({ id: "", date: selectedDate, ...form });
  const goodCount = currentInsights.filter(i => i.level === "good").length;
  const warningCount = currentInsights.filter(i => i.level === "warning").length;
  const alertCount = currentInsights.filter(i => i.level === "alert").length;
  const filledMetrics = [form.hrv, form.restingHeartRate, form.sleepHours, form.activityMinutes, form.stressLevel, form.respiratoryRate, form.skinTemperature].filter(v => v > 0).length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              Health Monitor
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your health metrics manually from your wearable device data
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-card border border-border px-4 py-2 rounded-xl text-sm">
              <span className="text-muted-foreground">Entries: </span>
              <span className="font-bold text-foreground">{entries.length}</span>
            </div>
            <div className="bg-card border border-border px-4 py-2 rounded-xl text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                data-testid="input-date-selector"
                className="bg-transparent border-none outline-none font-medium text-foreground cursor-pointer"
              />
            </div>
          </div>
        </div>

        {filledMetrics > 0 && currentInsights.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-emerald-700">{goodCount}</p>
              <p className="text-xs text-emerald-600">Healthy</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-amber-700">{warningCount}</p>
              <p className="text-xs text-amber-600">Needs Attention</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-red-700">{alertCount}</p>
              <p className="text-xs text-red-600">Alerts</p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            data-testid="toggle-entry-form"
            className="flex items-center gap-2 text-lg font-bold font-display text-foreground"
          >
            {showForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {selectedEntry ? "Update Entry" : "Enter Data"} — {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Enter the data you see on your smartwatch, smart ring, or fitness tracker. You don't need to fill every field — just enter what you have. Leave fields at 0 to skip them.
                </p>
              </div>

              <div className="space-y-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Heart & Stress
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <MetricInput
                      label="Heart Rate Variability"
                      value={form.hrv}
                      onChange={(v) => setForm(f => ({ ...f, hrv: v }))}
                      min={0}
                      max={200}
                      step={1}
                      unit="ms"
                      icon={Heart}
                      color="bg-rose-500"
                      description="Higher = better recovery & resilience"
                    />
                    <MetricInput
                      label="Resting Heart Rate"
                      value={form.restingHeartRate}
                      onChange={(v) => setForm(f => ({ ...f, restingHeartRate: v }))}
                      min={0}
                      max={200}
                      step={1}
                      unit="bpm"
                      icon={Activity}
                      color="bg-red-500"
                      description="Lower = better cardiovascular fitness"
                    />
                    <StressSlider
                      value={form.stressLevel}
                      onChange={(v) => setForm(f => ({ ...f, stressLevel: v }))}
                    />
                    <MetricInput
                      label="Respiratory Rate"
                      value={form.respiratoryRate}
                      onChange={(v) => setForm(f => ({ ...f, respiratoryRate: v }))}
                      min={0}
                      max={40}
                      step={1}
                      unit="breaths/min"
                      icon={Wind}
                      color="bg-cyan-500"
                      description="Normal: 12-20 breaths per minute"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Sleep
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <MetricInput
                      label="Sleep Duration"
                      value={form.sleepHours}
                      onChange={(v) => setForm(f => ({ ...f, sleepHours: v }))}
                      min={0}
                      max={16}
                      step={0.5}
                      unit="hours"
                      icon={Moon}
                      color="bg-indigo-500"
                      description="Recommended: 7-9 hours"
                    />
                    <SleepQualityInput
                      value={form.sleepQuality}
                      onChange={(v) => setForm(f => ({ ...f, sleepQuality: v }))}
                    />
                    <MetricInput
                      label="Deep Sleep"
                      value={form.deepSleepPercent}
                      onChange={(v) => setForm(f => ({ ...f, deepSleepPercent: v }))}
                      min={0}
                      max={100}
                      step={1}
                      unit="% of total"
                      icon={Moon}
                      color="bg-violet-600"
                      description="Ideal: 15-25% of total sleep"
                    />
                    <MetricInput
                      label="REM Sleep"
                      value={form.remSleepPercent}
                      onChange={(v) => setForm(f => ({ ...f, remSleepPercent: v }))}
                      min={0}
                      max={100}
                      step={1}
                      unit="% of total"
                      icon={Brain}
                      color="bg-fuchsia-500"
                      description="Ideal: 20-30% of total sleep"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Flame className="w-4 h-4" /> Activity & Body
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <MetricInput
                      label="Active Minutes"
                      value={form.activityMinutes}
                      onChange={(v) => setForm(f => ({ ...f, activityMinutes: v }))}
                      min={0}
                      max={480}
                      step={5}
                      unit="minutes"
                      icon={Flame}
                      color="bg-orange-500"
                      description="Target: 30+ minutes daily"
                    />
                    <MetricInput
                      label="Steps"
                      value={form.steps}
                      onChange={(v) => setForm(f => ({ ...f, steps: v }))}
                      min={0}
                      max={50000}
                      step={500}
                      unit="steps"
                      icon={Activity}
                      color="bg-emerald-500"
                      description="Recommended: 8,000-10,000 daily"
                    />
                    <MetricInput
                      label="Skin Temperature"
                      value={form.skinTemperature}
                      onChange={(v) => setForm(f => ({ ...f, skinTemperature: v }))}
                      min={30}
                      max={42}
                      step={0.1}
                      unit="°C"
                      icon={Thermometer}
                      color="bg-amber-500"
                      description="Normal: 35-37.5°C"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                    data-testid="input-notes"
                    placeholder="How are you feeling? Any symptoms or observations..."
                    className="w-full p-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                data-testid="btn-save-health-data"
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all",
                  saved
                    ? "bg-emerald-500 text-white"
                    : "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg hover:scale-[1.01]"
                )}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> {selectedEntry ? "Update Entry" : "Save Entry"}
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {currentInsights.length > 0 && filledMetrics > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Health Insights
            </h2>
            <div className="space-y-3">
              {currentInsights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "p-4 rounded-2xl border flex items-start gap-3",
                    insight.level === "good" && "bg-emerald-50 border-emerald-200",
                    insight.level === "warning" && "bg-amber-50 border-amber-200",
                    insight.level === "alert" && "bg-red-50 border-red-200"
                  )}
                >
                  <InsightBadge level={insight.level} />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{insight.category}</p>
                    <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {entries.length >= 2 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold font-display text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Trends
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <TrendChart data={entries} dataKey="hrv" label="HRV" color="#f43f5e" />
              <TrendChart data={entries} dataKey="restingHeartRate" label="Resting Heart Rate" color="#ef4444" />
              <TrendChart data={entries} dataKey="sleepHours" label="Sleep Hours" color="#6366f1" />
              <TrendChart data={entries} dataKey="stressLevel" label="Stress Level" color="#a855f7" />
              <TrendChart data={entries} dataKey="deepSleepPercent" label="Deep Sleep %" color="#7c3aed" />
              <TrendChart data={entries} dataKey="remSleepPercent" label="REM Sleep %" color="#d946ef" />
              <TrendChart data={entries} dataKey="activityMinutes" label="Active Minutes" color="#f97316" />
              <TrendChart data={entries} dataKey="steps" label="Steps" color="#10b981" />
              <TrendChart data={entries} dataKey="respiratoryRate" label="Respiratory Rate" color="#06b6d4" />
              <TrendChart data={entries} dataKey="skinTemperature" label="Skin Temperature" color="#f59e0b" />
            </div>
          </div>
        )}

        <div className="mt-8 mb-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            data-testid="toggle-history"
            className="flex items-center gap-2 text-lg font-bold font-display text-foreground"
          >
            {showHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            Entry History ({entries.length})
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-3"
              >
                {entries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No entries yet. Start tracking today!</p>
                ) : (
                  [...entries].reverse().map((entry) => {
                    const entryInsights = generateInsights(entry);
                    const eGood = entryInsights.filter(i => i.level === "good").length;
                    const eWarn = entryInsights.filter(i => i.level === "warning").length;
                    const eAlert = entryInsights.filter(i => i.level === "alert").length;

                    return (
                      <div key={entry.id} className="bg-card border border-border rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">
                            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex items-center gap-2">
                            {eGood > 0 && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{eGood} good</span>}
                            {eWarn > 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{eWarn} warning</span>}
                            {eAlert > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{eAlert} alert</span>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          {entry.hrv > 0 && <span>HRV: {entry.hrv}ms</span>}
                          {entry.restingHeartRate > 0 && <span>HR: {entry.restingHeartRate}bpm</span>}
                          {entry.sleepHours > 0 && <span>Sleep: {entry.sleepHours}h</span>}
                          {entry.stressLevel > 0 && <span>Stress: {entry.stressLevel}/10</span>}
                          {entry.activityMinutes > 0 && <span>Active: {entry.activityMinutes}min</span>}
                          {entry.steps > 0 && <span>Steps: {entry.steps.toLocaleString()}</span>}
                        </div>
                        {entry.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{entry.notes}"</p>}
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
