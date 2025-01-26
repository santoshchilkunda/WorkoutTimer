import { useState, useEffect, useCallback } from "react";
import { audioManager } from "@/lib/audio";

type Phase = "workout" | "rest" | "idle";

interface WorkoutSet {
  workoutDuration: number;
  restDuration: number;
  rounds: number;
}

const DEFAULT_SET: WorkoutSet = {
  workoutDuration: 60,
  restDuration: 30,
  rounds: 3
};

export function useWorkoutTimer() {
  const [sets, setSets] = useState<WorkoutSet[]>([{ ...DEFAULT_SET }]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(sets[0].workoutDuration);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize audio when component mounts
  useEffect(() => {
    audioManager.initializeAudio();
  }, []);

  const currentSet = sets[currentSetIndex];

  // Update timeLeft when durations change or current set changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(
        currentPhase === "workout" ? currentSet.workoutDuration : 
        currentPhase === "rest" ? currentSet.restDuration : 
        currentSet.workoutDuration
      );
    }
  }, [currentSet.workoutDuration, currentSet.restDuration, currentPhase, isRunning]);

  const reset = useCallback(() => {
    setSets([{ ...DEFAULT_SET }]);
    setCurrentSetIndex(0);
    setCurrentRound(1);
    setCurrentPhase("idle");
    setTimeLeft(DEFAULT_SET.workoutDuration);
    setIsRunning(false);
  }, []);

  const addSet = useCallback(() => {
    setSets(prev => [...prev, { ...DEFAULT_SET }]);
  }, []);

  const removeSet = useCallback((index: number) => {
    setSets(prev => {
      if (prev.length === 1) return prev; // Don't remove the last set
      return prev.filter((_, i) => i !== index);
    });
    // Adjust currentSetIndex if necessary
    setCurrentSetIndex(current => 
      index <= current ? Math.max(0, current - 1) : current
    );
  }, []);

  const updateSet = useCallback((index: number, updates: Partial<WorkoutSet>) => {
    setSets(prev => prev.map((set, i) => 
      i === index ? { ...set, ...updates } : set
    ));
  }, []);

  const start = async () => {
    // Ensure audio is initialized and resume if needed
    await audioManager.initializeAudio();
    setCurrentPhase("workout");
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // Play countdown beep for last 3 seconds of any phase
        if (prev <= 3 && prev > 0) {
          void audioManager.playCountdown();
        }

        if (prev <= 0) {
          if (currentPhase === "workout") {
            if (currentRound >= currentSet.rounds) {
              // Check if there are more sets
              if (currentSetIndex < sets.length - 1) {
                void audioManager.playPhaseChange();
                setCurrentSetIndex(prev => prev + 1);
                setCurrentRound(1);
                setCurrentPhase("workout");
                return sets[currentSetIndex + 1].workoutDuration;
              } else {
                // Workout complete
                setIsRunning(false);
                setCurrentPhase("idle");
                void audioManager.playComplete();
                return currentSet.workoutDuration;
              }
            }
            void audioManager.playPhaseChange();
            setCurrentPhase("rest");
            return currentSet.restDuration;
          } else {
            void audioManager.playPhaseChange();
            setCurrentPhase("workout");
            setCurrentRound((r) => r + 1);
            return currentSet.workoutDuration;
          }
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, currentPhase, currentRound, currentSet, currentSetIndex, sets]);

  // Calculate progress percentage
  const progress = timeLeft / (currentPhase === "workout" ? currentSet.workoutDuration : currentSet.restDuration);

  return {
    sets,
    currentSetIndex,
    currentSet,
    currentRound,
    currentPhase,
    timeLeft,
    isRunning,
    progress,
    addSet,
    removeSet,
    updateSet,
    start,
    pause,
    reset
  };
}