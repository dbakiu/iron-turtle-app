import { useState, useEffect } from "react";
import { Check, Trash2, Pencil, MoreVertical } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkoutSet, SetType } from "@/types/workout";
import {
  useUpdateSetMutation,
  useCompleteSetMutation,
  useRemoveSetMutation,
} from "@/store/api/activeWorkoutApi";

interface ActiveSetCardProps {
  set: WorkoutSet;
  exerciseId: string;
  setIndex: number;
  isOpen: boolean;
  isFuture: boolean;
  setEditing: (setId: string | null) => void;
}

const setTypes: SetType[] = ["WARMUP", "WORKING", "MYOREP", "FAILURE", "AMRAP"];

export function ActiveSetCard({
  set,
  exerciseId,
  setIndex,
  isOpen,
  isFuture,
  setEditing,
}: ActiveSetCardProps) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState((set.reps || set.duration || 0).toString());
  const [setType, setSetType] = useState(set.set_type);

  const [updateSet] = useUpdateSetMutation();
  const [completeSet] = useCompleteSetMutation();
  const [removeSet] = useRemoveSetMutation();

  useEffect(() => {
    setWeight(set.weight.toString());
    setReps((set.reps || set.duration || 0).toString());
    setSetType(set.set_type);
  }, [set]);

  const handleUpdate = (field: "weight" | "reps" | "setType") => {
    const isDuration = set.duration !== undefined;
    let updates: Partial<WorkoutSet> = {};

    switch (field) {
      case "weight":
        updates = { weight: parseFloat(weight) || 0 };
        break;
      case "reps":
        updates = { [isDuration ? "duration" : "reps"]: parseInt(reps, 10) || 0 };
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

  const handleQuickAdd = (field: "weight" | "reps", amount: number) => {
    let newValue: number;
    if (field === "weight") {
      newValue = (parseFloat(weight) || 0) + amount;
      setWeight(newValue.toString());
      updateSet({ exerciseId, setId: set.id, updates: { weight: newValue } });
    } else {
      newValue = (parseInt(reps, 10) || 0) + amount;
      setReps(newValue.toString());
      const isDuration = set.duration !== undefined;
      updateSet({ exerciseId, setId: set.id, updates: { [isDuration ? "duration" : "reps"]: newValue } });
    }
  };

  const handleComplete = async () => {
    const wasCompleted = set.is_completed;
    await updateSet({
      exerciseId,
      setId: set.id,
      updates: {
        weight: parseFloat(weight) || 0,
        [set.duration !== undefined ? "duration" : "reps"]: parseInt(reps, 10) || 0,
        set_type: setType,
        is_completed: true, // Ensure it's marked as completed
      },
    });
    // Only call completeSet if it wasn't already completed, to avoid creating multiple history entries if logic changes
    if (!wasCompleted) {
      await completeSet({ exerciseId, setId: set.id });
    }
    setEditing(null); // Exit editing mode on completion
  };

  const handleRemove = () => {
    removeSet({ exerciseId, setId: set.id });
  };

  const handleMakeEditable = () => {
    setEditing(set.id);
  };

  if (isFuture) {
    return (
      <Card className="p-4 bg-muted/50 border-dashed">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Set {setIndex + 1}</span>
          <span className="text-sm text-muted-foreground">{set.weight} kg x {set.reps} reps</span>
        </div>
      </Card>
    );
  }

  if (!isOpen) {
    return (
      <Card className={cn(set.is_completed && "bg-primary/10")}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                "set-badge",
                set.set_type === "WARMUP" && "set-badge-warmup",
                set.set_type === "WORKING" && "set-badge-working",
                set.set_type === "MYOREP" && "set-badge-myorep",
                set.set_type === "FAILURE" && "set-badge-failure",
              )}
            >
              {set.set_type.charAt(0)}
            </span>
            <p className="font-semibold">
              Set {setIndex + 1}: <span className="font-normal">{set.weight} kg x {set.reps} reps</span>
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMakeEditable}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemove} className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    );
  }

  // Open (isOpen) set
  return (
    <Card className={cn(isOpen && !set.is_completed && "border-primary ring-2 ring-primary")}>
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-muted-foreground">
          Set {setIndex + 1}
        </CardTitle>
        <Select value={setType} onValueChange={handleTypeChange}>
          <SelectTrigger
            className={cn(
              "w-auto h-10 px-3 border-2 rounded-lg font-bold text-base",
              "focus:ring-0 focus:ring-offset-0", // override default focus
              setType === "WARMUP" &&
                "border-warmup/50 text-warmup hover:bg-warmup/10",
              setType === "WORKING" &&
                "border-working/50 text-working hover:bg-working/10",
              setType === "MYOREP" &&
                "border-myorep/50 text-myorep hover:bg-myorep/10",
              setType === "FAILURE" &&
                "border-failure/50 text-failure hover:bg-failure/10",
              setType === "AMRAP" &&
                "border-amber-500/50 text-amber-500 hover:bg-amber-500/10",
            )}
          >
            <SelectValue>{setType}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {setTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="grid grid-cols-[1fr_1fr] items-start gap-3">
          <div className="flex flex-col items-center">
            <label className="text-xs uppercase text-muted-foreground mb-1">Weight (kg)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="numeric-input h-12 w-full text-center text-xl rounded-lg"
              aria-label="Weight"
              inputMode="decimal"
              onBlur={() => handleUpdate("weight")}
              min={0}
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => handleQuickAdd("weight", 2.5)}>+2.5</Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickAdd("weight", 5)}>+5</Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickAdd("weight", 10)}>+10</Button>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <label className="text-xs uppercase text-muted-foreground mb-1">
              {set.duration !== undefined ? "Seconds" : "Reps"}
            </label>
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="numeric-input h-12 w-full text-center text-xl rounded-lg"
              aria-label={set.duration !== undefined ? "Duration (seconds)" : "Reps"}
              inputMode="numeric"
              onBlur={() => handleUpdate("reps")}
              min={0}
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => handleQuickAdd("reps", 1)}>+1</Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickAdd("reps", 5)}>+5</Button>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleComplete}
          className="w-full h-12 text-lg"
        >
          <Check className="w-5 h-5 mr-2" />
          {set.is_completed ? "Save Changes" : "Complete Set"}
        </Button>
      </CardContent>
    </Card>
  );
}