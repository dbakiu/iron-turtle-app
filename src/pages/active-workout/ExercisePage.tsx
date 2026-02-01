import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LayoutList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActiveSetCard } from "@/components/ActiveSetCard";
import { cn } from "@/lib/utils";
import {
  useGetActiveWorkoutQuery,
  useAddSetMutation,
} from "@/store/api/activeWorkoutApi";
import { useAppSelector, useAppDispatch } from "@/store";
import { addRestTime, stopRestTimer } from "@/store/slices/uiSlice";
import type { WorkoutExercise, ActiveSetCreate } from "@/types/workout";
import { RestTimer } from "./RestTimer";
import { ExerciseNavigation } from "./ExerciseNavigation";
import { ExerciseReference } from "./ExcerciseReference";
import { SetsList } from "./SetsList";
import { ExerciseHeader } from "./ExerciseHeader";

export default function ExercisePage() {
  const { workoutExerciseId } = useParams<{ workoutExerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: activeWorkout, isLoading } = useGetActiveWorkoutQuery();
  const [addSet] = useAddSetMutation();
  const restTimer = useAppSelector((s) => s.ui.restTimer);

  const workoutExercise = useMemo<WorkoutExercise | null>(() => {
    if (!activeWorkout || !workoutExerciseId) return null;
    return (
      activeWorkout.exercises.find((e) => e.id === workoutExerciseId) ?? null
    );
  }, [activeWorkout, workoutExerciseId]);

  const currentSetIndex = useMemo(() => {
    if (!workoutExercise) return -1;
    return workoutExercise.sets.findIndex((s) => !s.is_completed);
  }, [workoutExercise]);

  const nextExerciseId = useMemo(() => {
    if (!activeWorkout || !workoutExerciseId) return null;
    const index = activeWorkout.exercises.findIndex(
      (e) => e.id === workoutExerciseId,
    );
    return activeWorkout.exercises[index + 1]?.id ?? null;
  }, [activeWorkout, workoutExerciseId]);

  if (isLoading) return <CenteredMessage text="Loading..." />;
  if (!workoutExercise) return <CenteredMessage text="Exercise not found." />;

  const handleAddSet = () => {
    const last = workoutExercise.sets.at(-1);
    const payload: ActiveSetCreate = {
      exercise_id: workoutExercise.exercise.id,
      set_type: last?.set_type ?? "WORKING",
      weight: last?.weight ?? 0,
      reps: last?.reps ?? 0,
      duration: last?.duration,
      is_completed: false,
    };
    addSet({ exerciseId: workoutExercise.id, set: payload });
  };

  return (
    <div className="min-h-screen bg-background pb-44">
      <ExerciseHeader exercise={workoutExercise.exercise} />

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <SetsList
          exercise={workoutExercise}
          currentSetIndex={currentSetIndex}
          onAddSet={handleAddSet}
        />

        <ExerciseReference exercise={workoutExercise.exercise} />

        <ExerciseNavigation
          hasNext={Boolean(nextExerciseId)}
          onNext={() =>
            nextExerciseId
              ? navigate(`/workout/active/exercise/${nextExerciseId}`)
              : navigate("/workout/active")
          }
          allCompleted={workoutExercise.sets.every((s) => s.is_completed)}
        />
      </div>

      {restTimer.isRunning && (
        <RestTimer
          seconds={restTimer.seconds}
          onAddTime={() => dispatch(addRestTime(15))}
          onStop={() => dispatch(stopRestTimer())}
        />
      )}
    </div>
  );
}

function CenteredMessage({ text }: { text: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
