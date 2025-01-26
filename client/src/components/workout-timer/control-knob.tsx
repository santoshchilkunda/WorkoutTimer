import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ControlKnobProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export function ControlKnob({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit
}: ControlKnobProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-muted-foreground">
          {value} {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}
