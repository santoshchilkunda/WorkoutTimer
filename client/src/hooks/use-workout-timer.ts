import { useState, useEffect, useCallback } from "react";
import { audioManager } from "@/lib/audio";

type Phase = "workout" | "rest" | "idle";

export function useWorkoutTimer() {
  const [workoutDuration, setWorkoutDuration] = useState(60);
  const [restDuration, setRestDuration] = useState(30);
  const [rounds, setRounds] = useState(3);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(workoutDuration);
  const [isRunning, setIsRunning] = useState(false);

  const reset = useCallback(() => {
    setCurrentRound(1);
    setCurrentPhase("idle");
    setTimeLeft(workoutDuration);
    setIsRunning(false);
  }, [workoutDuration]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 4 && prev > 0) {
          audioManager.playCountdown();
        }
        
        if (prev <= 0) {
          if (currentPhase === "workout") {
            if (currentRound >= rounds) {
              setIsRunning(false);
              setCurrentPhase("idle");
              return workoutDuration;
            }
            audioManager.playPhaseChange();
            setCurrentPhase("rest");
            return restDuration;
          } else {
            audioManager.playPhaseChange();
            setCurrentPhase("workout");
            setCurrentRound((r) => r + 1);
            return workoutDuration;
          }
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, currentPhase, currentRound, rounds, workoutDuration, restDuration]);

  // Calculate progress percentage
  const progress = timeLeft / (currentPhase === "workout" ? workoutDuration : restDuration);

  return {
    workoutDuration,
    restDuration,
    rounds,
    currentRound,
    currentPhase,
    timeLeft,
    isRunning,
    progress,
    setWorkoutDuration,
    setRestDuration,
    setRounds,
    start,
    pause,
    reset
  };
}
