import { Link } from "react-router-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, MoreVertical, GripVertical, Dumbbell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WorkoutExercise } from "@/types/workout";

interface WorkoutExerciseCardProps {
  workoutExercise: WorkoutExercise;
  onDelete: (workoutExerciseId: string) => void;
}

export default function WorkoutExerciseCard({
  workoutExercise,
  onDelete,
}: WorkoutExerciseCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workoutExercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  const isCompleted = workoutExercise.sets.every((set) => set.is_completed);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "stat-card p-3 flex items-center justify-between relative",
        isDragging && "ring-2 ring-primary",
        isCompleted && "bg-green-500/10",
      )}
    >
      <div
        {...listeners}
        {...attributes}
        className="touch-action-none absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <Link
        to={`/workout/active/exercise/${workoutExercise.id}`}
        className="flex-grow flex items-center gap-3 ml-8"
      >
        <div className="flex-grow">
          <h3 className="font-semibold text-base truncate">
            {workoutExercise.exercise.name}
          </h3>
          {workoutExercise.exercise.primary_muscle_group && (
            <p className="text-xs text-muted-foreground capitalize mt-0 mb-0 pt-0.5">
              {workoutExercise.exercise.primary_muscle_group
                .toLowerCase()
                .replace(/_/g, " ")}
            </p>
          )}
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {isCompleted && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDelete(workoutExercise.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
