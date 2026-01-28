import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon, ListMusic, Heart, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

import music1 from "@assets/sleep-music-vol16-195422_1769638343920.mp3";
import music2 from "@assets/Magical-Moments-chosic.com__1769638343921.mp3";
import music3 from "@assets/Beauty(chosic.com)_1769638343921.mp3";

const PLAYLIST = [
  { id: 1, title: "Sleep Music Vol. 16", artist: "Deep Relaxation", url: music1, duration: "3:45", color: "from-indigo-500 to-purple-600" },
  { id: 2, title: "Magical Moments", artist: "Ethereal Soundscapes", url: music2, duration: "4:12", color: "from-emerald-500 to-teal-600" },
  { id: 3, title: "Beauty", artist: "Pure Calm", url: music3, duration: "2:58", color: "from-rose-400 to-pink-600" }
];

const SLEEP_TIMER_OPTIONS = [
  { label: "Off", value: 0 },
  { label: "10 min", value: 10 },
  { label: "30 min", value: 30 },
  { label: "60 min", value: 60 }
];

export default function Music() {
  const { toast } = useToast();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [sleepTimer, setSleepTimer] = useState(0); // in minutes
  const [timerRemaining, setTimerRemaining] = useState(0); // in seconds
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (sleepTimer > 0) {
      setTimerRemaining(sleepTimer * 60);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      
      timerIntervalRef.current = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setSleepTimer(0);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            toast({
              title: "Sleep Timer",
              description: "Music paused automatically.",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setTimerRemaining(0);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sleepTimer]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (vals: number[]) => {
    if (audioRef.current) {
      const newTime = (vals[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(vals[0]);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold font-display text-primary">Calm Radio</h1>
          <p className="text-muted-foreground mt-2">Curated soundscapes to help you focus or unwind.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-primary" />
          <div className="flex gap-1">
            {SLEEP_TIMER_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={sleepTimer === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSleepTimer(opt.value)}
                className="rounded-full text-[10px] h-7"
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Player UI */}
        <div className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900 aspect-square max-w-md mx-auto relative group">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.color} opacity-10`} />
            <CardContent className="h-full flex flex-col p-12 relative z-10">
              <div className="flex-1 flex items-center justify-center">
                <motion.div 
                  key={currentTrack.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className={`w-64 h-64 rounded-[3rem] bg-gradient-to-br ${currentTrack.color} shadow-2xl flex items-center justify-center relative overflow-hidden`}
                >
                  <MusicIcon className="w-24 h-24 text-white/40" />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [10, 40, 20, 35, 15] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1.5 bg-white/60 rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="space-y-6 text-center">
                <div>
                  <h2 className="text-2xl font-bold font-display mb-1">{currentTrack.title}</h2>
                  <p className="text-muted-foreground font-medium">{currentTrack.artist}</p>
                  {sleepTimer > 0 && (
                    <p className="text-[10px] font-black uppercase text-primary mt-2">
                      Sleep Timer: {Math.floor(timerRemaining / 60)}:{(timerRemaining % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Slider 
                    value={[progress]} 
                    max={100} 
                    step={0.1} 
                    onValueChange={handleProgressChange}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "0:00"}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary" onClick={prevTrack}>
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-20 h-20 rounded-full shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary" onClick={nextTrack}>
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 max-w-md mx-auto px-8">
            <Volume2 className="w-5 h-5 text-slate-400" />
            <Slider 
              value={[volume]} 
              max={100} 
              onValueChange={(vals) => setVolume(vals[0])}
              className="flex-1"
            />
          </div>
        </div>

        {/* Playlist UI */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-bold font-display flex items-center gap-2">
              <ListMusic className="w-6 h-6 text-primary" /> Playlist
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {PLAYLIST.length} Tracks
            </span>
          </div>

          <div className="space-y-3">
            {PLAYLIST.map((track, index) => (
              <div 
                key={track.id}
                onClick={() => { setCurrentTrackIndex(index); setIsPlaying(true); }}
                className={`group flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all border ${
                  currentTrackIndex === index 
                    ? "bg-primary/5 border-primary/20 shadow-sm" 
                    : "bg-white dark:bg-slate-900 border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                  {currentTrackIndex === index && isPlaying ? (
                    <div className="flex gap-0.5">
                      <span className="w-1 h-4 bg-white/80 rounded-full animate-pulse" />
                      <span className="w-1 h-6 bg-white/80 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-4 bg-white/80 rounded-full animate-pulse delay-150" />
                    </div>
                  ) : (
                    <Play className={`w-6 h-6 text-white/80 ${currentTrackIndex === index ? "fill-current" : ""}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold leading-tight ${currentTrackIndex === index ? "text-primary" : ""}`}>
                    {track.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400">{track.duration}</span>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
             <h4 className="font-bold mb-2">Music & ADHD</h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Binaural beats and ambient textures can help mask environmental distractions and provide a steady auditory anchor for focus.
             </p>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.url} />
    </DashboardLayout>
  );
}

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
