import { useState, useEffect, useRef } from "react";
import { Check, Trash2, Pencil, X } from "lucide-react";
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
  isCurrent: boolean;
  isFuture: boolean;
}

const setTypes: SetType[] = ["WARMUP", "WORKING", "MYOREP", "FAILURE", "AMRAP"];

export function ActiveSetRow({
  set,
  exerciseId,
  isCurrent,
  isFuture,
}: ActiveSetRowProps) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState((set.reps || set.duration || 0).toString());
  const [setType, setSetType] = useState(set.set_type);
  const [showCompletedActionButtons, setShowCompletedActionButtons] =
    useState(false);

  const longPressTimer = useRef<NodeJS.Timeout>();

  const [updateSet] = useUpdateSetMutation();
  const [completeSet] = useCompleteSetMutation();
  const [removeSet] = useRemoveSetMutation();

  useEffect(() => {
    setWeight(set.weight.toString());
    setReps((set.reps || set.duration || 0).toString());
    setSetType(set.set_type);
    // Hide buttons if set state changes from completed to not completed
    if (!set.is_completed) {
      setShowCompletedActionButtons(false);
    }
  }, [set]);

  const handleUpdate = (field: "weight" | "reps" | "setType") => {
    const isDuration = set.duration !== undefined;
    let updates: Partial<WorkoutSet> = {};

    switch (field) {
      case "weight":
        updates = { weight: parseFloat(weight) || 0 };
        break;
      case "reps":
        updates = {
          [isDuration ? "duration" : "reps"]: parseInt(reps, 10) || 0,
        };
        break;
      case "setType":
        updates = { set_type: setType };
        break;
    }
    updateSet({ exerciseId, setId: set.id, updates });
  };

  const handleTypeChange = (value: SetType) => {
    setSetType(value);
    updateSet({ exerciseId, setId: set.id, updates: { set_type: value } });
  };

  const handleComplete = async () => {
    await updateSet({
      exerciseId,
      setId: set.id,
      updates: {
        weight: parseFloat(weight) || 0,
        [set.duration !== undefined ? "duration" : "reps"]:
          parseInt(reps, 10) || 0,
        set_type: setType,
      },
    });
    await completeSet({ exerciseId, setId: set.id });
  };

  const handleRemove = () => {
    removeSet({ exerciseId, setId: set.id });
  };

  const handleMakeEditable = () => {
    updateSet({
      exerciseId,
      setId: set.id,
      updates: { is_completed: false },
    });
    setShowCompletedActionButtons(false);
  };

  const handlePressStart = () => {
    if (isCurrent || isFuture || !set.is_completed) return;
    longPressTimer.current = setTimeout(() => {
      setShowCompletedActionButtons((prev) => !prev);
    }, 500); // 500ms for a long press
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const isCompleted = set.is_completed && !isCurrent;
  const isEditable = !isFuture && (!set.is_completed || isCurrent);

  return (
    <div
      className={cn(
        "p-2 rounded-lg transition-all duration-200 ease-in-out",
        isCompleted && "bg-primary/10",
        isCurrent && "bg-primary/20",
        isFuture && "opacity-50 bg-muted/50",
      )}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <div className="grid grid-cols-[48px_1fr_1fr] items-center gap-2">
        <Select
          value={setType}
          onValueChange={handleTypeChange}
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
            <SelectValue>{setType.charAt(0)}</SelectValue>
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
          type="number"
          value={weight}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => setWeight(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="numeric-input h-10 w-full text-center rounded-md"
          aria-label="Weight"
          inputMode="decimal"
          onBlur={() => handleUpdate("weight")}
          min={0}
          disabled={!isEditable}
        />

        <Input
          type="number"
          value={reps}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => setReps(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="numeric-input h-10 w-full text-center rounded-md"
          aria-label={
            set.duration !== undefined ? "Duration (seconds)" : "Reps"
          }
          inputMode="numeric"
          onBlur={() => handleUpdate("reps")}
          min={0}
          disabled={!isEditable}
        />
      </div>

      {isCurrent && (
        <div className="flex justify-center items-center gap-1 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleComplete}
            className="gap-2"
          >
            <Check className="w-4 h-4" />
            Complete
          </Button>
        </div>
      )}

      {showCompletedActionButtons && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleMakeEditable}
            className="gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
