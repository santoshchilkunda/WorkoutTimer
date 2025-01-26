import { useState, useEffect, useCallback, useMemo } from "react";
import { audioManager } from "@/lib/audio";

type Phase = "workout" | "rest" | "idle" | "countdown";

interface WorkoutSet {
  workoutDuration: number;
  restDuration: number;
  rounds: number;
  initialCountdown: number;
  details: string;
}

const DEFAULT_SET: WorkoutSet = {
  workoutDuration: 60,
  restDuration: 30,
  rounds: 3,
  initialCountdown: 15,
  details: ""
};

export function useWorkoutTimer() {
  const [sets, setSets] = useState<WorkoutSet[]>([{ ...DEFAULT_SET }]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(sets[0].workoutDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize audio when component mounts
  useEffect(() => {
    audioManager.initializeAudio();
  }, []);

  const currentSet = sets[currentSetIndex];

  // Calculate total workout time for all sets
  const totalTime = useMemo(() => {
    return sets.reduce((total, set) => {
      return total + (set.workoutDuration + set.restDuration) * set.rounds;
    }, 0);
  }, [sets]);

  // Update timeLeft when durations change or current set changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(
        currentPhase === "workout" ? currentSet.workoutDuration :
          currentPhase === "rest" ? currentSet.restDuration :
            currentPhase === "countdown" ? currentSet.initialCountdown :
              currentSet.workoutDuration
      );
    }
  }, [currentSet.workoutDuration, currentSet.restDuration, currentSet.initialCountdown, currentPhase, isRunning]);

  const reset = useCallback(() => {
    setSets([{ ...DEFAULT_SET }]);
    setCurrentSetIndex(0);
    setCurrentRound(1);
    setCurrentPhase("idle");
    setTimeLeft(DEFAULT_SET.workoutDuration);
    setIsRunning(false);
    setElapsedTime(0);
  }, []);

  const addSet = useCallback(() => {
    setSets(prev => [...prev, { ...DEFAULT_SET }]);
    setCurrentSetIndex(prev => prev + 1);
  }, []);

  const removeSet = useCallback((index: number) => {
    setSets(prev => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
    setCurrentSetIndex(current =>
      index <= current ? Math.max(0, current - 1) : current
    );
  }, []);

  const updateSet = useCallback((index: number, updates: Partial<WorkoutSet>) => {
    setSets(prev => prev.map((set, i) =>
      i === index ? { ...set, ...updates } : set
    ));
  }, []);

  // Modified start function to handle initial start and resume
  const start = async () => {
    await audioManager.initializeAudio();
    // Only reset state if we're starting fresh (not resuming)
    if (currentPhase === "idle") {
      setCurrentSetIndex(0);
      setCurrentRound(1);
      setCurrentPhase("countdown");
      setTimeLeft(sets[0].initialCountdown);
      setElapsedTime(0);
    }
    setIsRunning(true);
  };

  const resume = async () => {
    // Simply continue from current state
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 3 && prev > 0) {
          void audioManager.playCountdown();
        }

        if (prev <= 0) {
          if (currentPhase === "countdown") {
            void audioManager.playPhaseChange();
            setCurrentPhase("workout");
            return currentSet.workoutDuration;
          } else if (currentPhase === "workout") {
            void audioManager.playPhaseChange();
            setCurrentPhase("rest");
            return currentSet.restDuration;
          } else if (currentPhase === "rest") {
            if (currentRound >= currentSet.rounds) {
              if (currentSetIndex < sets.length - 1) {
                void audioManager.playPhaseChange();
                setCurrentSetIndex(prev => prev + 1);
                setCurrentRound(1);
                setCurrentPhase("countdown");
                return sets[currentSetIndex + 1].initialCountdown;
              } else {
                setIsRunning(false);
                setCurrentPhase("idle");
                void audioManager.playComplete();
                return currentSet.workoutDuration;
              }
            } else {
              void audioManager.playPhaseChange();
              setCurrentPhase("workout");
              setCurrentRound((r) => r + 1);
              return currentSet.workoutDuration;
            }
          }
        }
        return prev - 0.1;
      });

      setElapsedTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, currentPhase, currentRound, currentSet, currentSetIndex, sets]);

  const progress = timeLeft / (
    currentPhase === "workout" ? currentSet.workoutDuration :
      currentPhase === "rest" ? currentSet.restDuration :
        currentPhase === "countdown" ? currentSet.initialCountdown :
          currentSet.workoutDuration
  );

  return {
    sets,
    currentSetIndex,
    setCurrentSetIndex,
    currentSet,
    currentRound,
    currentPhase,
    timeLeft,
    isRunning,
    progress,
    totalTime,
    elapsedTime,
    addSet,
    removeSet,
    updateSet,
    start,
    resume,
    pause,
    reset
  };
}