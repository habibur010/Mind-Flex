import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Brain, Grid3X3, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GameType = 'none' | 'reaction' | 'memory' | 'sudoku';

export default function Games() {
  const [game, setGame] = useState<GameType>('none');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Brain Gym</h1>
        <p className="text-muted-foreground mt-2">Quick games to activate your focus and reset your mind.</p>
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
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">⚡ Reaction Tapper</h3>
                <p className="opacity-80 text-sm">Test your reflex speed.</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setGame('memory')}
            className={`w-full p-4 rounded-2xl text-left transition-all ${
              game === 'memory' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-card hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">🧩 Memory Match</h3>
                <p className="opacity-80 text-sm">Find the matching pairs.</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setGame('sudoku')}
            className={`w-full p-4 rounded-2xl text-left transition-all ${
              game === 'sudoku' 
                ? 'bg-primary text-primary-foreground shadow-lg' 
                : 'bg-card hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Grid3X3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">🔢 Mini Sudoku</h3>
                <p className="opacity-80 text-sm">Focus with numbers.</p>
              </div>
            </div>
          </button>
        </div>

        {/* Game Area */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border min-h-[500px] flex items-center justify-center relative overflow-hidden p-6">
          <AnimatePresence mode="wait">
            {game === 'none' && (
              <motion.div 
                key="none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center p-8"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-12 h-12 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold text-muted-foreground/50">Select a game to start</h3>
              </motion.div>
            )}
            
            {game === 'reaction' && <ReactionGame key="reaction" />}
            {game === 'memory' && <MemoryMatch key="memory" />}
            {game === 'sudoku' && <SudokuGame key="sudoku" />}
          </AnimatePresence>
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full h-full min-h-[400px] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
        status === 'waiting' ? 'bg-red-500' :
        status === 'ready' ? 'bg-green-500' :
        status === 'finished' ? 'bg-blue-500' :
        'bg-muted/30'
      }`}
      onClick={handleClick}
    >
      {status === 'idle' && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Reaction Tapper</h2>
          <p className="text-muted-foreground mb-8">Click when the screen turns green!</p>
          <Button size="lg" className="rounded-full text-lg px-8">Start Game <Play className="ml-2 w-4 h-4" /></Button>
        </div>
      )}
      
      {status === 'waiting' && (
        <h2 className="text-4xl font-bold text-white animate-pulse">Wait for Green...</h2>
      )}

      {status === 'ready' && (
        <h2 className="text-6xl font-bold text-white animate-bounce">CLICK NOW!</h2>
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
    </motion.div>
  );
}

function MemoryMatch() {
  const icons = ['🌟', '🍎', '🌈', '🍦', '🎸', '🚀', '🏀', '🎨'];
  const [cards, setCards] = useState<{ id: number, emoji: string, flipped: boolean, matched: boolean }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initGame = useCallback(() => {
    const deck = [...icons, ...icons]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));
    setCards(deck);
    setFlipped([]);
    setMoves(0);
  }, []);

  useEffect(() => initGame(), [initGame]);

  const handleFlip = (id: number) => {
    if (flipped.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        newCards[first].matched = true;
        newCards[second].matched = true;
        setCards(newCards);
        setFlipped([]);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards(newCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const won = cards.length > 0 && cards.every(c => c.matched);

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Memory Match</h2>
        <div className="text-sm font-medium bg-muted px-3 py-1 rounded-full">Moves: {moves}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.flipped || card.matched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
              card.flipped || card.matched ? 'bg-primary text-white rotate-0' : 'bg-muted text-transparent rotate-180'
            }`}
            onClick={() => handleFlip(card.id)}
          >
            {(card.flipped || card.matched) && card.emoji}
          </motion.div>
        ))}
      </div>
      {won && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
          <p className="text-xl font-bold text-primary mb-4">You matched them all! 🎉</p>
          <Button onClick={initGame} className="rounded-full">
            <RotateCcw className="w-4 h-4 mr-2" /> Play Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function SudokuGame() {
  // 4x4 Mini Sudoku for focus
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [initialGrid, setInitialGrid] = useState<boolean[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  const initGame = useCallback(() => {
    // Very simple 4x4 generator
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 3, 4, 1],
      [4, 1, 2, 3]
    ];
    // Shuffle slightly
    const shuffled = base.sort(() => Math.random() - 0.5);
    const puzzle = shuffled.map(row => row.map(cell => Math.random() > 0.4 ? cell : null));
    const fixed = puzzle.map(row => row.map(cell => cell !== null));
    
    setGrid(puzzle);
    setInitialGrid(fixed);
    setSelected(null);
  }, []);

  useEffect(() => initGame(), [initGame]);

  const handleInput = (val: number) => {
    if (!selected) return;
    const [r, c] = selected;
    if (initialGrid[r][c]) return;
    
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = val;
    setGrid(newGrid);
  };

  const isComplete = grid.length > 0 && grid.every(row => row.every(cell => cell !== null));

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Mini Sudoku</h2>
      <div className="grid grid-cols-4 gap-1 bg-muted p-1 rounded-xl mb-6">
        {grid.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => setSelected([r, c])}
            className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all ${
              selected?.[0] === r && selected?.[1] === c ? 'bg-primary text-white ring-2 ring-primary/50' :
              initialGrid[r][c] ? 'bg-card text-foreground/50' : 'bg-card'
            }`}
          >
            {cell}
          </div>
        )))}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map(n => (
          <Button 
            key={n} 
            variant="outline" 
            className="rounded-xl h-12 text-lg font-bold"
            onClick={() => handleInput(n)}
          >
            {n}
          </Button>
        ))}
      </div>

      {isComplete && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
          <p className="text-lg font-bold text-green-600 mb-4">Focus achieved! 🧘</p>
          <Button onClick={initGame} variant="secondary" className="rounded-full">
            <RotateCcw className="w-4 h-4 mr-2" /> New Puzzle
          </Button>
        </motion.div>
      )}
    </div>
  );
}
