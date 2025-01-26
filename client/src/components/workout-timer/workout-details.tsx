import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WorkoutDetailsProps {
  details: string;
  currentSet: number;
  totalSets: number;
  className?: string;
}

export function WorkoutDetails({ details, currentSet, totalSets, className = "" }: WorkoutDetailsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <Label className="text-sm font-medium">Workout Details</Label>
        <span className="text-sm text-muted-foreground">
          Set: {currentSet} / {totalSets}
        </span>
      </div>
      <Textarea
        value={details}
        readOnly
        className="h-[300px] resize-none bg-muted/50"
      />
    </div>
  );
}