import { useState, useEffect, useCallback } from "react";
import { audioManager } from "@/lib/audio";

type Phase = "workout" | "rest" | "idle";

const INITIAL_STATE = {
  workoutDuration: 60,
  restDuration: 30,
  rounds: 3
};

export function useWorkoutTimer() {
  const [workoutDuration, setWorkoutDuration] = useState(INITIAL_STATE.workoutDuration);
  const [restDuration, setRestDuration] = useState(INITIAL_STATE.restDuration);
  const [rounds, setRounds] = useState(INITIAL_STATE.rounds);

  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhase, setCurrentPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(workoutDuration);
  const [isRunning, setIsRunning] = useState(false);

  // Update timeLeft when durations change
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(currentPhase === "workout" ? workoutDuration : 
                 currentPhase === "rest" ? restDuration : 
                 workoutDuration);
    }
  }, [workoutDuration, restDuration, currentPhase, isRunning]);

  const reset = useCallback(() => {
    setWorkoutDuration(INITIAL_STATE.workoutDuration);
    setRestDuration(INITIAL_STATE.restDuration);
    setRounds(INITIAL_STATE.rounds);
    setCurrentRound(1);
    setCurrentPhase("idle");
    setTimeLeft(INITIAL_STATE.workoutDuration);
    setIsRunning(false);
  }, []);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 3 && prev > 0) {
          audioManager.playCountdown();
        }

        if (prev <= 0) {
          if (currentPhase === "workout") {
            if (currentRound >= rounds) {
              setIsRunning(false);
              setCurrentPhase("idle");
              audioManager.playComplete();
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