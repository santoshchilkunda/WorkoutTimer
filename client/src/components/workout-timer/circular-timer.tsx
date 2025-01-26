import { cva } from "class-variance-authority";

const phaseStyles = cva(
  "w-full h-full rounded-full transition-colors duration-300",
  {
    variants: {
      phase: {
        workout: "bg-primary",
        rest: "bg-orange-500",
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
  phase: "workout" | "rest" | "idle";
  currentRound?: number;
  totalRounds?: number;
}

export function CircularTimer({ progress, timeLeft, phase, currentRound, totalRounds }: CircularTimerProps) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

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
          className={`fill-none stroke-current stroke-[12] transition-all duration-500 ${
            phase === "workout" ? "stroke-primary" : "stroke-orange-500"
          }`}
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
          phase === "workout" ? "text-primary" : "text-orange-500"
        }`}>
          {phase === "workout" ? "WORKOUT" : phase === "rest" ? "REST" : "READY"}
        </div>
        {phase !== "idle" && currentRound && totalRounds && (
          <div className="text-sm text-muted-foreground mt-1">
            Round: {currentRound} / {totalRounds}
          </div>
        )}
      </div>
    </div>
  );
}