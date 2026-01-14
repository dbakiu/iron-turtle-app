import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Check, Clock, Dumbbell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetActiveWorkoutQuery,
  useStartWorkoutMutation,
  useFinishWorkoutMutation,
  useDiscardWorkoutMutation,
  useReorderExercisesMutation,
  useRemoveExerciseFromWorkoutMutation,
} from "@/store/api/activeWorkoutApi";
import { useSaveCompletedWorkoutMutation } from "@/store/api/historyApi";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  tickWorkoutDuration,
  resetWorkoutDuration,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import WorkoutExerciseCard from "@/components/WorkoutExerciseCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";


export default function WorkoutOverview() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { data: activeWorkout, isLoading } = useGetActiveWorkoutQuery();
  const [startWorkout] = useStartWorkoutMutation();
  const [finishWorkout] = useFinishWorkoutMutation();
  const [discardWorkout] = useDiscardWorkoutMutation();
  const [saveCompletedWorkout] = useSaveCompletedWorkoutMutation();
  const [reorderExercises] = useReorderExercisesMutation();
  const [removeExerciseFromWorkout] = useRemoveExerciseFromWorkoutMutation();

  // DND
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (activeWorkout && over && active.id !== over.id) {
      const oldIndex = activeWorkout.exercises.findIndex(
        (ex) => ex.id === active.id,
      );
      const newIndex = activeWorkout.exercises.findIndex(
        (ex) => ex.id === over.id,
      );

      const reorderedExercises = arrayMove(
        activeWorkout.exercises,
        oldIndex,
        newIndex,
      );

      await reorderExercises({
        exerciseIds: reorderedExercises.map((ex) => ex.id),
      });
    }
  };

  const handleDeleteExercise = async (workoutExerciseId: string) => {
    await removeExerciseFromWorkout(workoutExerciseId);
    toast({
      title: "Exercise removed",
      variant: "destructive",
    });
  };

  const { workoutDuration } = useAppSelector((state) => state.ui);

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={activeWorkout.exercises.map((ex) => ex.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {activeWorkout.exercises.map((workoutExercise) => (
                    <WorkoutExerciseCard
                      key={workoutExercise.id}
                      workoutExercise={workoutExercise}
                      onDelete={handleDeleteExercise}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Action Button */}
      {activeWorkout.exercises.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pb-4">
          <div className="max-w-lg mx-auto">
            {completedSets > 0 ? (
              <Button
                onClick={handleFinishWorkout}
                className="w-full h-14 text-lg font-semibold"
                style={{ borderRadius: "var(--radius)" }}
              >
                <Check className="w-5 h-5 mr-2" />
                Finish Workout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const firstUncompleted = activeWorkout.exercises.find(
                    (ex) => !ex.sets.every((set) => set.is_completed),
                  );
                  if (firstUncompleted) {
                    navigate(`/workout/active/exercise/${firstUncompleted.id}`);
                  }
                }}
                className="w-full h-14 text-lg font-semibold"
                style={{ borderRadius: "var(--radius)" }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Exercise
              </Button>
            )}
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
          <Dumbbell className="w-5 h-5" />
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
