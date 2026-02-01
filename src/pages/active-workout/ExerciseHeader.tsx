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
  const subtext = exercise.primary_muscle_group
    ?.replace(/_/g, " ")
    .toLowerCase();

  return (
    <header className="grid grid-cols-[48px_1fr_48px] items-center p-4 border-b border-border bg-background">
      <div className="flex justify-start">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/workout/active" aria-label="Workout Overview">
                <LayoutList className="w-6 h-6" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Workout Overview</TooltipContent>
        </Tooltip>
      </div>

      <div className="text-center min-w-0">
        <h1 className="text-lg font-bold truncate px-2" title={exercise.name}>
          {exercise.name}
        </h1>
        {subtext && (
          <p className="text-sm text-muted-foreground capitalize truncate">
            {subtext}
          </p>
        )}
      </div>

      <div className="w-12" aria-hidden="true" />
    </header>
  );
}
