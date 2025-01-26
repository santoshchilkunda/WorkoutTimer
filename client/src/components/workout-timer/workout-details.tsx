import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WorkoutDetailsProps {
  details: string;
  className?: string;
}

export function WorkoutDetails({ details, className = "" }: WorkoutDetailsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="text-sm font-medium">Workout Details</Label>
      <Textarea
        value={details}
        readOnly
        className="h-[300px] resize-none bg-muted/50"
      />
    </div>
  );
}
