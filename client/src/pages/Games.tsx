import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function Games() {
  const [game, setGame] = useState<'none' | 'reaction'>('none');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Brain Gym</h1>
        <p className="text-muted-foreground mt-2">Quick games to activate your focus.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Game Menu */}
        <div className="lg:col-span-1 space-y-4">
          <button 
            onClick={() => setGame('reaction')}
            className={`w-full p-4 rounded-2xl text-left transition-all ${
              game === 'reaction' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-card hover:bg-muted'
            }`}
          >
            <h3 className="font-bold text-lg">⚡ Reaction Tapper</h3>
            <p className="opacity-80 text-sm">Test your reflex speed.</p>
          </button>
          
          <button className="w-full p-4 rounded-2xl text-left bg-card hover:bg-muted opacity-50 cursor-not-allowed">
            <h3 className="font-bold text-lg">🧩 Memory Match</h3>
            <p className="opacity-80 text-sm">Coming Soon</p>
          </button>
        </div>

        {/* Game Area */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border min-h-[400px] flex items-center justify-center relative overflow-hidden">
          {game === 'none' && (
            <div className="text-center p-8">
              <h3 className="text-2xl font-bold text-muted-foreground/50">Select a game to start</h3>
            </div>
          )}
          
          {game === 'reaction' && <ReactionGame />}
        </div>
      </div>
    </DashboardLayout>
  );
}

function ReactionGame() {
  const [status, setStatus] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [startTime, setStartTime] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === 'waiting') {
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds
      timeout = setTimeout(() => {
        setStatus('ready');
        setStartTime(Date.now());
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  const handleClick = () => {
    if (status === 'idle') {
      setStatus('waiting');
    } else if (status === 'waiting') {
      setStatus('idle'); // Too early
      alert("Too early! Wait for green.");
    } else if (status === 'ready') {
      const time = Date.now() - startTime;
      setScore(time);
      setStatus('finished');
    } else if (status === 'finished') {
      setStatus('waiting');
    }
  };

  return (
    <div 
      className={`w-full h-full min-h-[400px] flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
        status === 'waiting' ? 'bg-red-500' :
        status === 'ready' ? 'bg-green-500' :
        status === 'finished' ? 'bg-blue-500' :
        'bg-card'
      }`}
      onClick={handleClick}
    >
      {status === 'idle' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Reaction Tapper</h2>
          <Button size="lg" className="rounded-full text-lg px-8">Start Game <Play className="ml-2 w-4 h-4" /></Button>
        </div>
      )}
      
      {status === 'waiting' && (
        <h2 className="text-4xl font-bold text-white">Wait for Green...</h2>
      )}

      {status === 'ready' && (
        <h2 className="text-6xl font-bold text-white">CLICK NOW!</h2>
      )}

      {status === 'finished' && (
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-2">{score} ms</h2>
          <p className="mb-8 opacity-90">Great job!</p>
          <Button variant="secondary" className="rounded-full" onClick={(e) => { e.stopPropagation(); setStatus('waiting'); }}>
            <RotateCcw className="mr-2 w-4 h-4" /> Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
