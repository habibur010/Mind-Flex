import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

export default function Timer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const totalSeconds = (isWorkSession ? workMinutes : breakMinutes) * 60;
  const remainingSeconds = totalSeconds - seconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && seconds < totalSeconds) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (seconds >= totalSeconds && isRunning) {
      if (!muted) {
        audioRef.current?.play().catch(() => {});
      }
      setIsWorkSession(!isWorkSession);
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, totalSeconds, isWorkSession, muted]);

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setIsWorkSession(true);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: "Architects Daughter" }}>
              Focus Timer
            </h1>
            <p className="text-slate-600 dark:text-slate-300">Combat time blindness with visual focus sessions</p>
          </div>

          {/* Timer Display */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
            <CardContent className="pt-12 pb-12">
              <div className="text-center space-y-6">
                {/* Circular Display */}
                <div className="flex justify-center">
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center shadow-inner">
                    <div className="text-center">
                      <div className="text-7xl font-bold text-blue-600 dark:text-blue-300" style={{ fontFamily: "DM Sans" }}>
                        {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                      </div>
                      <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                        {isWorkSession ? "Work Time" : "Break Time"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-4">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isWorkSession
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-gradient-to-r from-green-500 to-green-600"
                      }`}
                      style={{ width: `${(seconds / totalSeconds) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    data-testid="button-toggle-timer"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-5 h-5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" /> Start
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    data-testid="button-reset-timer"
                  >
                    <RotateCcw className="w-5 h-5" /> Reset
                  </Button>
                  <Button
                    onClick={() => setMuted(!muted)}
                    variant="outline"
                    size="lg"
                    data-testid="button-toggle-sound"
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="work-minutes" className="text-sm font-medium">
                    Work Duration (minutes)
                  </Label>
                  <Input
                    id="work-minutes"
                    type="number"
                    min="1"
                    max="60"
                    value={workMinutes}
                    onChange={(e) => {
                      setWorkMinutes(parseInt(e.target.value) || 25);
                      if (!isRunning) setSeconds(0);
                    }}
                    disabled={isRunning}
                    className="text-center text-lg font-semibold"
                    data-testid="input-work-minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-minutes" className="text-sm font-medium">
                    Break Duration (minutes)
                  </Label>
                  <Input
                    id="break-minutes"
                    type="number"
                    min="1"
                    max="30"
                    value={breakMinutes}
                    onChange={(e) => {
                      setBreakMinutes(parseInt(e.target.value) || 5);
                      if (!isRunning) setSeconds(0);
                    }}
                    disabled={isRunning}
                    className="text-center text-lg font-semibold"
                    data-testid="input-break-minutes"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold">Pro Tip:</span> Use the Pomodoro technique to combat time blindness. Set focused work sessions and take breaks to maintain energy and prevent burnout.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Today's Focus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Pomodoro Timer helps you stay aware of time while working. Perfect for ADHD brains that struggle with time awareness.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden audio element for notification */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=="
      />
    </DashboardLayout>
  );
}
