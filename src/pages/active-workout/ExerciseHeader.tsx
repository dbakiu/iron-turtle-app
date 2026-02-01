import { Link } from "react-router-dom";
import { LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Exercise } from "@/types/workout";

interface Props {
  exercise: Exercise;
}

export function ExerciseHeader({ exercise }: Props) {
  return (
    <header className="p-4 flex items-center border-b border-border truncate">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/workout/active">
              <Button variant="ghost" size="icon">
                <LayoutList className="w-6 h-6" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Workout Overview</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex-grow text-center truncate">
        <h1 className="text-lg font-bold px-4">{exercise.name}</h1>
        {exercise.primary_muscle_group && (
          <p className="text-sm text-muted-foreground capitalize">
            {exercise.primary_muscle_group.replace(/_/g, " ").toLowerCase()}
          </p>
        )}
      </div>
    </header>
  );
}
