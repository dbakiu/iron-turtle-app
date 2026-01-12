import { ActiveSetRow } from "@/components/ActiveSetRow";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Check,
  Clock,
  Dumbbell,
  X,
  Play,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetActiveWorkoutQuery,
  useStartWorkoutMutation,
  useFinishWorkoutMutation,
  useDiscardWorkoutMutation,
  useAddSetMutation,
} from "@/store/api/activeWorkoutApi";
import { useSaveCompletedWorkoutMutation } from "@/store/api/historyApi";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  tickWorkoutDuration,
  resetWorkoutDuration,
  startRestTimer,
  tickRestTimer,
  stopRestTimer,
  addRestTime,
  setActiveExerciseId,
} from "@/store/slices/uiSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { data: activeWorkout, isLoading } = useGetActiveWorkoutQuery();
  const [startWorkout] = useStartWorkoutMutation();
  const [finishWorkout] = useFinishWorkoutMutation();
  const [discardWorkout] = useDiscardWorkoutMutation();
  const [saveCompletedWorkout] = useSaveCompletedWorkoutMutation();
  const [addSet] = useAddSetMutation();

  const { workoutDuration, activeExerciseId } = useAppSelector(
    (state) => state.ui,
  );
  const restTimer = useAppSelector((state) => state.ui.restTimer);

  // Ref to track the previous activeWorkout state for completion transitions
  const prevActiveWorkoutRef = useRef(activeWorkout);

  // Duration timer
  useEffect(() => {
    if (!activeWorkout) {
      dispatch(resetWorkoutDuration());
      return;
    }

    const interval = setInterval(() => {
      dispatch(tickWorkoutDuration());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout, dispatch]);

  // Rest timer
  useEffect(() => {
    if (!restTimer.isRunning) return;

    const interval = setInterval(() => {
      dispatch(tickRestTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer.isRunning, dispatch]);

  // Auto-open next exercise / auto-collapse completed exercise
  useEffect(() => {
    // If activeWorkout becomes null, ensure activeExerciseId is null
    if (!activeWorkout) {
      if (activeExerciseId !== null) {
        dispatch(setActiveExerciseId(null));
      }
      prevActiveWorkoutRef.current = null; // Reset ref
      return;
    }

    // Initialize prevActiveWorkoutRef if it's the first render with an activeWorkout
    if (!prevActiveWorkoutRef.current) {
      prevActiveWorkoutRef.current = activeWorkout;
      // On initial load, if there's an active workout, open the first uncompleted exercise
      if (activeExerciseId === null && activeWorkout.exercises.length > 0) {
        const firstUncompleted = activeWorkout.exercises.find(
          (ex) => !ex.sets.every((set) => set.is_completed),
        );
        if (firstUncompleted) {
          dispatch(setActiveExerciseId(firstUncompleted.id));
        }
      }
      return;
    }

    // Compare current activeWorkout with previous activeWorkout
    const prevExercises = prevActiveWorkoutRef.current.exercises;
    const currentExercises = activeWorkout.exercises;

    // Find the exercise that was previously open and check if it just completed
    const currentOpenExercise = currentExercises.find(
      (ex) => ex.id === activeExerciseId,
    );
    const prevOpenExercise = prevExercises.find(
      (ex) => ex.id === activeExerciseId,
    );

    // Only act if the currently open exercise (which was previously open) just became completed.
    // This condition prevents auto-closing of manually opened *already completed* exercises.
    if (
      activeExerciseId &&
      currentOpenExercise &&
      prevOpenExercise &&
      !prevOpenExercise.sets.every((set) => set.is_completed) && // Was uncompleted
      currentOpenExercise.sets.every((set) => set.is_completed)
    ) {
      // Now completed

      const currentIndex = currentExercises.findIndex(
        (ex) => ex.id === activeExerciseId,
      );
      const nextUncompletedExercise = currentExercises
        .slice(currentIndex + 1)
        .find((ex) => !ex.sets.every((set) => set.is_completed));

      if (nextUncompletedExercise) {
        dispatch(setActiveExerciseId(nextUncompletedExercise.id));
      } else {
        // All exercises are now completed. Close all collapsibles.
        // This dispatch is safe because this condition only triggers when the last uncompleted set is completed.
        dispatch(setActiveExerciseId(null));
      }
    }

    // Update the ref for the next render cycle
    prevActiveWorkoutRef.current = activeWorkout;
  }, [activeWorkout, activeExerciseId, dispatch]);

  const handleStartEmptyWorkout = async () => {
    await startWorkout({ name: "New Workout" });
    dispatch(resetWorkoutDuration());
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkout) return;

    const completedSets = activeWorkout.exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => s.is_completed).length,
      0,
    );

    if (completedSets === 0) {
      toast({
        title: "No sets completed",
        description: "Complete at least one set before finishing",
        variant: "destructive",
      });
      return;
    }

    const result = await finishWorkout();
    if ("data" in result && result.data) {
      await saveCompletedWorkout(result.data);
      toast({
        title: "Workout completed! 💪",
        description: `Great job! You completed ${completedSets} sets.`,
      });
    }

    navigate("/");
  };

  const handleDiscardWorkout = async () => {
    await discardWorkout();
    navigate("/");
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = activeWorkout?.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet = {
      exercise_id: exercise.exercise.id,
      set_type: lastSet?.set_type || "WORKING",
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      duration: lastSet?.duration,
      is_completed: false,
    };

    addSet({ exerciseId, set: newSet });
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 max-w-lg mx-auto min-h-[80vh] flex flex-col items-center justify-center pb-24">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <Dumbbell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Active Workout</h2>
            <p className="text-muted-foreground mb-8">
              Start a new workout to begin tracking your sets
            </p>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="w-full"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Start Workout
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[40vh]">
                <SheetHeader>
                  <SheetTitle>Start New Workout</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link to="/templates">
                    <Button variant="default" size="lg" className="w-full">
                      Start from Template
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleStartEmptyWorkout}
                  >
                    Start Empty Workout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const totalSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0,
  );
  const completedSets = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.is_completed).length,
    0,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 max-w-lg mx-auto pb-44">
        {/* Header */}
        <header className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{activeWorkout.name}</h1>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard Workout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will discard all your progress in this workout. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDiscardWorkout}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-medium tabular-nums">
                {formatDuration(workoutDuration)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Check className="w-4 h-4" />
              <span className="font-medium">
                {completedSets}/{totalSets} sets
              </span>
            </div>
          </div>
        </header>

        {/* Exercise List */}
        <div className="space-y-4">
          {activeWorkout.exercises.length === 0 ? (
            <div className="stat-card text-center py-12">
              <p className="text-muted-foreground mb-4">
                No exercises added yet
              </p>
              <Link to="/exercises">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </Link>
            </div>
          ) : (
            activeWorkout.exercises.map((workoutExercise) => {
              const currentSetIndex = workoutExercise.sets.findIndex(
                (s) => !s.is_completed,
              );

              return (
                <Collapsible
                  key={workoutExercise.id}
                  open={activeExerciseId === workoutExercise.id}
                  onOpenChange={(isOpen) =>
                    dispatch(
                      setActiveExerciseId(isOpen ? workoutExercise.id : null),
                    )
                  }
                >
                  <div
                    className={cn(
                      "stat-card",
                      workoutExercise.sets.every((set) => set.is_completed) &&
                        activeExerciseId !== workoutExercise.id &&
                        "bg-green-500/20",
                    )}
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-left">
                          {workoutExercise.exercise.name}
                        </h3>
                        {workoutExercise.exercise.primary_muscle_group && (
                          <p className="text-xs text-muted-foreground capitalize text-left mt-0 mb-0 pt-1">
                            {workoutExercise.exercise.primary_muscle_group
                              .toLowerCase()
                              .replace(/_/g, " ")}
                          </p>
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-muted-foreground transition-transform",
                          activeExerciseId === workoutExercise.id &&
                            "rotate-180",
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex items-center gap-2 px-2 pb-2 mt-3 border-b border-border">
                        <span className="w-8 text-left text-xs uppercase font-medium text-muted-foreground">
                          #
                        </span>
                        <span className="w-12 text-left text-xs uppercase font-medium text-muted-foreground">
                          Type
                        </span>
                        <span className="flex-1 text-center text-xs uppercase font-medium text-muted-foreground">
                          Weight (kg)
                        </span>
                        <span className="flex-1 text-center text-xs uppercase font-medium text-muted-foreground">
                          Reps
                        </span>
                        <span className="w-20 text-right text-xs uppercase font-medium text-muted-foreground"></span>{" "}
                        {/* For action buttons */}
                      </div>
                      <div className="space-y-2 pt-2">
                        {workoutExercise.sets.map((set, index) => (
                          <ActiveSetRow
                            key={set.id}
                            set={set}
                            exerciseId={workoutExercise.id}
                            setIndex={index}
                            isCurrent={index === currentSetIndex}
                            isFuture={
                              currentSetIndex !== -1 && index > currentSetIndex
                            }
                          />
                        ))}
                        <Button
                          variant="outline"
                          className="w-full border-dashed mt-2"
                          onClick={() => handleAddSet(workoutExercise.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Set
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })
          )}
        </div>
      </div>

      {/* Rest Timer */}
      {restTimer.isRunning && (
        <div className="fixed bottom-36 left-0 right-0 z-50 px-4">
          <div className="glass-panel rounded-xl p-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground uppercase tracking-wide">
                  Rest
                </span>
                <span
                  className={cn(
                    "text-3xl font-bold tabular-nums",
                    restTimer.seconds <= 10 && "text-destructive",
                  )}
                >
                  {Math.floor(restTimer.seconds / 60)}:
                  {(restTimer.seconds % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => dispatch(addRestTime(15))}
                >
                  +15s
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => dispatch(stopRestTimer())}
                >
                  Stop
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finish Workout Button */}
      {activeWorkout.exercises.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-4">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={handleFinishWorkout}
              className="w-full h-14 text-lg font-semibold"
              style={{ borderRadius: "var(--radius)" }}
              disabled={completedSets === 0}
            >
              <Check className="w-5 h-5 mr-2" />
              Finish Workout
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <Link to="/" className="nav-link flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/templates" className="nav-link flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Templates</span>
        </Link>
        <Link to="/workout/active" className="nav-link-active flex-1">
          <Play className="w-5 h-5" />
          <span className="text-xs font-medium">Workout</span>
        </Link>
        <Link to="/exercises" className="nav-link flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Exercises</span>
        </Link>
      </div>
    </nav>
  );
}
