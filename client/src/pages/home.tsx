import { Card } from "@/components/ui/card";
import { CircularTimer } from "@/components/workout-timer/circular-timer";
import { ControlKnob } from "@/components/workout-timer/control-knob";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { audioManager } from "@/lib/audio";
import { Slider } from "@/components/ui/slider";

export default function Home() {
  const {
    isRunning,
    currentPhase,
    timeLeft,
    progress,
    workoutDuration,
    restDuration,
    rounds,
    setWorkoutDuration,
    setRestDuration,
    setRounds,
    start,
    pause,
    reset
  } = useWorkoutTimer();

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  const toggleMute = () => {
    audioManager.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-accent p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl p-6 shadow-xl bg-background/95 backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Workout Timer
          </h1>
          <p className="text-muted-foreground mt-2">
            Set your intervals and get moving!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <CircularTimer
              progress={progress}
              timeLeft={timeLeft}
              phase={currentPhase}
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <ControlKnob
                label="Workout Duration"
                value={workoutDuration}
                onChange={setWorkoutDuration}
                min={10}
                max={300}
                step={5}
                unit="sec"
              />
              <ControlKnob
                label="Rest Duration"
                value={restDuration}
                onChange={setRestDuration}
                min={5}
                max={120}
                step={5}
                unit="sec"
              />
              <ControlKnob
                label="Rounds"
                value={rounds}
                onChange={setRounds}
                min={1}
                max={10}
                step={1}
                unit="rounds"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    className="w-32 ml-2"
                    value={[volume]}
                    onValueChange={([v]) => handleVolumeChange(v)}
                    min={0}
                    max={1}
                    step={0.1}
                    disabled={isMuted}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={isRunning ? pause : start}
                className="w-32"
              >
                {isRunning ? (
                  <><Pause className="mr-2 h-4 w-4" /> Pause</>
                ) : (
                  <><Play className="mr-2 h-4 w-4" /> Start</>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={reset}
                className="w-32"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}