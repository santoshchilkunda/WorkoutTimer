import { Progress } from "@/components/ui/progress";

interface StatusBarProps {
  totalTime: number;
  elapsedTime: number;
  currentPhase: "workout" | "rest" | "idle";
}

export function StatusBar({ totalTime, elapsedTime, currentPhase }: StatusBarProps) {
  const progress = (elapsedTime / totalTime) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{Math.round(progress)}%</span>
        <span>{Math.round((1 - progress / 100) * totalTime)}s remaining</span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 ${
          currentPhase === "workout" 
            ? "bg-primary/20 [&>[role=progressbar]]:bg-primary" 
            : currentPhase === "rest"
            ? "bg-orange-500/20 [&>[role=progressbar]]:bg-orange-500"
            : ""
        }`}
      />
    </div>
  );
}