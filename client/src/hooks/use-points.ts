import { useState, useEffect, useCallback } from "react";

const POINTS_KEY = "mindflex_points";
const TASKS_COMPLETED_KEY = "mindflex_tasks_completed";
const STREAK_KEY = "mindflex_streak";
const LAST_ACTIVE_KEY = "mindflex_last_active";
const GAMES_PLAYED_KEY = "mindflex_games_played";
const MOODS_LOGGED_KEY = "mindflex_moods_logged";

function getStored(key: string, fallback: number): number {
  const val = localStorage.getItem(key);
  return val ? parseInt(val, 10) : fallback;
}

function setStored(key: string, value: number) {
  localStorage.setItem(key, String(value));
  window.dispatchEvent(new CustomEvent("mindflex-stats-update"));
}

export function usePoints() {
  const [points, setPointsState] = useState(() => getStored(POINTS_KEY, 0));
  const [tasksCompleted, setTasksCompletedState] = useState(() => getStored(TASKS_COMPLETED_KEY, 0));
  const [streak, setStreakState] = useState(() => getStored(STREAK_KEY, 1));
  const [gamesPlayed, setGamesPlayedState] = useState(() => getStored(GAMES_PLAYED_KEY, 0));
  const [moodsLogged, setMoodsLoggedState] = useState(() => getStored(MOODS_LOGGED_KEY, 0));

  const refresh = useCallback(() => {
    setPointsState(getStored(POINTS_KEY, 0));
    setTasksCompletedState(getStored(TASKS_COMPLETED_KEY, 0));
    setStreakState(getStored(STREAK_KEY, 1));
    setGamesPlayedState(getStored(GAMES_PLAYED_KEY, 0));
    setMoodsLoggedState(getStored(MOODS_LOGGED_KEY, 0));
  }, []);

  useEffect(() => {
    window.addEventListener("mindflex-stats-update", refresh);
    return () => window.removeEventListener("mindflex-stats-update", refresh);
  }, [refresh]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const diff = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        const newStreak = getStored(STREAK_KEY, 1) + 1;
        setStored(STREAK_KEY, newStreak);
        setStreakState(newStreak);
      } else if (diff > 1) {
        setStored(STREAK_KEY, 1);
        setStreakState(1);
      }
    }
    localStorage.setItem(LAST_ACTIVE_KEY, today);
  }, []);

  const addPoints = useCallback((amount: number) => {
    const newVal = getStored(POINTS_KEY, 0) + amount;
    setStored(POINTS_KEY, Math.max(0, newVal));
    setPointsState(Math.max(0, newVal));
  }, []);

  const removePoints = useCallback((amount: number) => {
    const newVal = getStored(POINTS_KEY, 0) - amount;
    setStored(POINTS_KEY, Math.max(0, newVal));
    setPointsState(Math.max(0, newVal));
  }, []);

  const incrementTasksCompleted = useCallback(() => {
    const newVal = getStored(TASKS_COMPLETED_KEY, 0) + 1;
    setStored(TASKS_COMPLETED_KEY, newVal);
    setTasksCompletedState(newVal);
  }, []);

  const decrementTasksCompleted = useCallback(() => {
    const newVal = Math.max(0, getStored(TASKS_COMPLETED_KEY, 0) - 1);
    setStored(TASKS_COMPLETED_KEY, newVal);
    setTasksCompletedState(newVal);
  }, []);

  const incrementGamesPlayed = useCallback(() => {
    const newVal = getStored(GAMES_PLAYED_KEY, 0) + 1;
    setStored(GAMES_PLAYED_KEY, newVal);
    setGamesPlayedState(newVal);
  }, []);

  const incrementMoodsLogged = useCallback(() => {
    const newVal = getStored(MOODS_LOGGED_KEY, 0) + 1;
    setStored(MOODS_LOGGED_KEY, newVal);
    setMoodsLoggedState(newVal);
  }, []);

  const level = Math.floor(points / 100) + 1;
  const levelProgress = points % 100;
  const pointsToNext = 100 - levelProgress;

  const getLevelTitle = (lvl: number): string => {
    if (lvl >= 20) return "Legend";
    if (lvl >= 15) return "Champion";
    if (lvl >= 10) return "Master";
    if (lvl >= 7) return "Expert";
    if (lvl >= 5) return "Achiever";
    if (lvl >= 3) return "Explorer";
    if (lvl >= 2) return "Starter";
    return "Newcomer";
  };

  return {
    points,
    tasksCompleted,
    streak,
    gamesPlayed,
    moodsLogged,
    level,
    levelProgress,
    pointsToNext,
    levelTitle: getLevelTitle(level),
    addPoints,
    removePoints,
    incrementTasksCompleted,
    decrementTasksCompleted,
    incrementGamesPlayed,
    incrementMoodsLogged,
  };
}
