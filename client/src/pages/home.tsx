import { Card } from "@/components/ui/card";
import { CircularTimer } from "@/components/workout-timer/circular-timer";
import { ControlKnob } from "@/components/workout-timer/control-knob";
import { YouTubePlayer } from "@/components/workout-timer/youtube-player";
import { StatusBar } from "@/components/workout-timer/status-bar";
import { WorkoutDetails } from "@/components/workout-timer/workout-details";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { audioManager } from "@/lib/audio";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Home() {
  const {
    sets,
    currentSetIndex,
    setCurrentSetIndex,
    currentSet,
    isRunning,
    currentPhase,
    timeLeft,
    progress,
    currentRound,
    totalTime,
    elapsedTime,
    addSet,
    removeSet,
    updateSet,
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

  const handleYoutubePlayerReady = (player: any) => {
    audioManager.setYoutubePlayer(player);
  };

  const WorkoutView = () => (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Workout Timer
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
        <div className="flex flex-col items-center justify-center">
          <CircularTimer
            progress={progress}
            timeLeft={timeLeft}
            phase={currentPhase}
            currentRound={currentRound}
            totalRounds={currentSet.rounds}
            currentSet={currentSetIndex + 1}
            totalSets={sets.length}
          />
        </div>

        <div className="space-y-8">
          <WorkoutDetails
            details={currentSet.details || ""}
            className="mt-4 md:mt-0"
          />

          <div className="space-y-4">
            <YouTubePlayer onPlayerReady={handleYoutubePlayerReady} />
          </div>
        </div>
      </div>

      {/* Status bar spanning full width */}
      <div className="w-full max-w-none mb-8">
        <StatusBar
          totalTime={totalTime}
          elapsedTime={elapsedTime}
          currentPhase={currentPhase}
        />
      </div>

      <div className="flex justify-center gap-4">
        <Button 
          size="lg" 
          onClick={pause}
          className="w-32"
        >
          <Pause className="mr-2 h-4 w-4" /> Pause
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={reset}
          className="w-32"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  );

  const SetupView = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Workout Timer
        </h1>
        <p className="text-muted-foreground mt-2">
          Set your intervals and get moving!
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center justify-center space-y-4">
            <CircularTimer
              progress={progress}
              timeLeft={timeLeft}
              phase={currentPhase}
              currentRound={currentRound}
              totalRounds={currentSet.rounds}
              currentSet={currentSetIndex + 1}
              totalSets={sets.length}
            />
            <div className="w-full max-w-sm">
              <StatusBar
                totalTime={totalTime}
                elapsedTime={elapsedTime}
                currentPhase={currentPhase}
              />
            </div>
          </div>

          <WorkoutDetails
            details={currentSet.details || ""}
            className="mt-4 md:mt-0"
          />
        </div>

        <div className="space-y-6">
          <Tabs
            value={currentSetIndex.toString()}
            onValueChange={(value) => setCurrentSetIndex(parseInt(value, 10))}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                {sets.map((_, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    disabled={isRunning}
                  >
                    Set {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addSet}
                  disabled={isRunning}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                {sets.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeSet(currentSetIndex)}
                    disabled={isRunning}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {sets.map((set, index) => (
              <TabsContent key={index} value={index.toString()}>
                <div className="space-y-6">
                  <ControlKnob
                    label="Initial Countdown"
                    value={set.initialCountdown}
                    onChange={(value) => updateSet(index, { initialCountdown: value })}
                    min={0}
                    max={180}
                    step={5}
                    unit="sec"
                  />
                  <ControlKnob
                    label="Workout Duration"
                    value={set.workoutDuration}
                    onChange={(value) => updateSet(index, { workoutDuration: value })}
                    min={10}
                    max={180}
                    step={5}
                    unit="sec"
                  />
                  <ControlKnob
                    label="Rest Duration"
                    value={set.restDuration}
                    onChange={(value) => updateSet(index, { restDuration: value })}
                    min={5}
                    max={180}
                    step={5}
                    unit="sec"
                  />
                  <ControlKnob
                    label="Rounds"
                    value={set.rounds}
                    onChange={(value) => updateSet(index, { rounds: value })}
                    min={1}
                    max={10}
                    step={1}
                    unit="rounds"
                  />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Workout Details</Label>
                    <Textarea
                      value={set.details || ""}
                      onChange={(e) => updateSet(index, { details: e.target.value })}
                      placeholder="Enter workout details, instructions, or notes..."
                      className="h-[100px]"
                      disabled={isRunning}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Audio Settings</h3>
            <YouTubePlayer onPlayerReady={handleYoutubePlayerReady} />

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

          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={start} className="w-32">
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
            <Button size="lg" variant="outline" onClick={reset} className="w-32">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-accent p-4 flex items-center justify-center">
      <Card className="w-full max-w-5xl p-6 shadow-xl bg-background/95 backdrop-blur">
        {isRunning ? <WorkoutView /> : <SetupView />}
      </Card>
    </div>
  );
}