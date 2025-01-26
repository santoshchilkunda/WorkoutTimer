import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

const phaseStyles = cva(
  "w-full h-full rounded-full transition-colors duration-300",
  {
    variants: {
      phase: {
        workout: "bg-primary",
        rest: "bg-orange-500",
        countdown: "bg-blue-500",
        idle: "bg-muted",
      },
    },
    defaultVariants: {
      phase: "idle",
    },
  }
);

interface CircularTimerProps {
  progress: number;
  timeLeft: number;
  phase: "workout" | "rest" | "idle" | "countdown";
  currentRound?: number;
  totalRounds?: number;
  currentSet?: number;
  totalSets?: number;
}

export function CircularTimer({ 
  progress, 
  timeLeft, 
  phase, 
  currentRound, 
  totalRounds,
  currentSet,
  totalSets 
}: CircularTimerProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Add flashing effect for countdown
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (phase !== "countdown") return;

    const interval = setInterval(() => {
      setFlash(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [phase]);

  const getStrokeColor = () => {
    switch (phase) {
      case "workout":
        return "stroke-primary";
      case "rest":
        return "stroke-orange-500";
      case "countdown":
        return flash ? "stroke-blue-500" : "stroke-blue-300";
      default:
        return "stroke-muted";
    }
  };

  return (
    <div className="relative w-72 h-72">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          className="fill-none stroke-muted stroke-[12]"
        />
        {/* Progress circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          className={`fill-none stroke-current stroke-[12] transition-all duration-500 ${getStrokeColor()}`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-6xl font-bold tabular-nums">
          {Math.ceil(timeLeft)}
        </div>
        <div className={`text-lg font-medium mt-2 ${
          phase === "workout" ? "text-primary" :
          phase === "rest" ? "text-orange-500" :
          phase === "countdown" ? "text-blue-500" :
          ""
        }`}>
          {phase === "workout" ? "WORKOUT" :
           phase === "rest" ? "REST" :
           phase === "countdown" ? "GET READY" :
           "READY"}
        </div>
        <div className="text-sm text-muted-foreground mt-1 space-y-0.5">
          <div>Round: {currentRound || 1} / {totalRounds || 1}</div>
          <div>Set: {currentSet || 1} / {totalSets || 1}</div>
        </div>
      </div>
    </div>
  );
}