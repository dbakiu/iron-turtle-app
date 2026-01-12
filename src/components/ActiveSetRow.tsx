import { useState, useEffect, useRef } from "react";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutSet, SetType } from "@/types/workout";
import {
  useUpdateSetMutation,
  useCompleteSetMutation,
  useRemoveSetMutation,
} from "@/store/api/activeWorkoutApi";

interface ActiveSetRowProps {
  set: WorkoutSet;
  exerciseId: string;
  setIndex: number;
  isCurrent: boolean;
  isFuture: boolean;
}

const setTypes: SetType[] = ["WARMUP", "WORKING", "MYOREP", "FAILURE", "AMRAP"];

export function ActiveSetRow({
  set,
  exerciseId,
  setIndex,
  isCurrent,
  isFuture,
}: ActiveSetRowProps) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState((set.reps || set.duration || 0).toString());
  const [setType, setSetType] = useState(set.set_type);

  const weightInputRef = useRef<HTMLInputElement>(null);

  const [updateSet] = useUpdateSetMutation();
  const [completeSet] = useCompleteSetMutation();
  const [removeSet] = useRemoveSetMutation();

  useEffect(() => {
    setWeight(set.weight.toString());
    setReps((set.reps || set.duration || 0).toString());
    setSetType(set.set_type);
  }, [set]);

  const handleUpdate = () => {
    const isDuration = set.duration !== undefined;
    const updates: Partial<WorkoutSet> = {
      weight: parseFloat(weight) || 0,
      [isDuration ? "duration" : "reps"]: parseInt(reps, 10) || 0,
      set_type: setType,
    };
    updateSet({ exerciseId, setId: set.id, updates });
  };

  const handleComplete = async () => {
    handleUpdate();
    await completeSet({ exerciseId, setId: set.id });
    weightInputRef.current?.blur();
  };

  const handleRemove = () => {
    removeSet({ exerciseId, setId: set.id });
  };

  return (
    <div
      className={cn(
        'grid grid-cols-[32px_48px_1fr_1fr_40px_40px] items-center gap-2 p-2 rounded-lg transition-all duration-200 ease-in-out',
        // Base background (for all non-future, non-current, non-completed sets)
        'bg-background',

        // Apply completed style first, but only if not current.
        set.is_completed && !isCurrent && 'bg-primary/10',

        // Apply current style (overrides completed if it was also completed, though unlikely for current set)
        isCurrent && 'bg-primary/20',

        // Finally, apply future styling (overrides everything else and adds opacity)
        isFuture && 'opacity-50 bg-muted/50'
      )}
    >
      <span className="w-8 text-left text-xs text-muted-foreground">
        {setIndex + 1}
      </span>

      <Select
        value={setType}
        onValueChange={(value: SetType) => setSetType(value)}
        disabled={isFuture}
      >
        <SelectTrigger
          className={cn(
            "w-12 h-10 p-0 border-0 focus:ring-0 focus:ring-offset-0",
            "set-badge",
            setType === "WARMUP" && "set-badge-warmup",
            setType === "WORKING" && "set-badge-working",
            setType === "MYOREP" && "set-badge-myorep",
            setType === "FAILURE" && "set-badge-failure",
          )}
        >
          <SelectValue>
            {setType === "WARMUP"
              ? "W"
              : setType === "WORKING"
                ? "R"
                : setType === "MYOREP"
                  ? "M"
                  : setType === "FAILURE"
                    ? "F"
                    : "A"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {setTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        ref={weightInputRef}
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onFocus={(e) => e.target.select()}
        className="numeric-input h-10 w-full text-center rounded-md"
        aria-label="Weight"
        inputMode="decimal"
        onBlur={handleUpdate}
        min={0}
        disabled={set.is_completed || isFuture}
      />

      <Input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onFocus={(e) => e.target.select()}
        className="numeric-input h-10 w-full text-center rounded-md"
        aria-label={set.duration !== undefined ? "Duration (seconds)" : "Reps"}
        inputMode="numeric"
        onBlur={handleUpdate}
        min={0}
        disabled={set.is_completed || isFuture}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={handleComplete}
        disabled={set.is_completed || isFuture}
        className={cn(
          "w-10 h-10 rounded-lg",
          set.is_completed
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted hover:bg-muted-foreground/20",
        )}
        aria-label="Complete Set"
      >
        <Check className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="text-muted-foreground hover:text-destructive w-10 h-10"
        disabled={isFuture}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
