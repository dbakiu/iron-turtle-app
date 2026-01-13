import { useEffect, useState } from "react";
import {
  Plus,
  ChevronLeft,
  Clock,
  Film,
  Book,
  History,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetActiveWorkoutQuery,
  useAddSetMutation,
} from "@/store/api/activeWorkoutApi";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  tickRestTimer,
  startRestTimer,
  stopRestTimer,
  addRestTime,
} from "@/store/slices/uiSlice";
import { cn } from "@/lib/utils";
import { ActiveSetCard } from "@/components/ActiveSetCard";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function ExercisePage() {
  const { workoutExerciseId } = useParams<{ workoutExerciseId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const [activeReferenceTab, setActiveReferenceTab] = useState<
    "none" | "notes" | "history" | "alternatives"
  >("none");
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const { data: activeWorkout, isLoading } = useGetActiveWorkoutQuery();
  const [addSet] = useAddSetMutation();

  const restTimer = useAppSelector((state) => state.ui.restTimer);

  const workoutExercise = activeWorkout?.exercises.find(
    (ex) => ex.id === workoutExerciseId,
  );

  // Reset editing state when navigating to a new exercise
  useEffect(() => {
    setEditingSetId(null);
  }, [workoutExerciseId]);


  // Rest timer
  useEffect(() => {
    if (!restTimer.isRunning) return;

    const interval = setInterval(() => {
      dispatch(tickRestTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer.isRunning, dispatch]);

  const handleAddSet = () => {
    if (!workoutExercise) return;

    const lastSet = workoutExercise.sets[workoutExercise.sets.length - 1];
    const newSet = {
      exercise_id: workoutExercise.exercise.id,
      set_type: lastSet?.set_type || "WORKING",
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      duration: lastSet?.duration,
      is_completed: false,
    };

    addSet({ exerciseId: workoutExercise.id, set: newSet });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!activeWorkout || !workoutExercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          Exercise not found or no active workout.
        </p>
      </div>
    );
  }

  const currentSetIndex = workoutExercise.sets.findIndex(
    (s) => !s.is_completed,
  );

  return (
    <div className="min-h-screen bg-background pb-44">
      <header className="p-4 flex items-center justify-between border-b border-border">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="flex-grow text-center">
          <h1 className="text-xl font-bold truncate px-4">
            {workoutExercise.exercise.name}
          </h1>
          {workoutExercise.exercise.primary_muscle_group && (
            <p className="text-sm text-muted-foreground capitalize mt-0.5">
              {workoutExercise.exercise.primary_muscle_group
                .toLowerCase()
                .replace(/_/g, " ")}
            </p>
          )}
        </div>
        <div className="w-10"></div> {/* Spacer to balance header */}
      </header>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Sets List */}
        <div className="space-y-3">
          {workoutExercise.sets.map((set, index) => {
            const isOpen = (editingSetId === null && index === currentSetIndex) || editingSetId === set.id;
            
            return (
              <ActiveSetCard
                key={set.id}
                set={set}
                exerciseId={workoutExercise.id}
                setIndex={index}
                isOpen={isOpen}
                isFuture={currentSetIndex !== -1 && index > currentSetIndex}
                setEditing={setEditingSetId}
              />
            )
          })}
          <Button
            variant="outline"
            className="w-full border-dashed mt-2"
            onClick={handleAddSet}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Set
          </Button>

          {workoutExercise.sets.every((set) => set.is_completed) &&
            (() => {
              const currentIndex = activeWorkout.exercises.findIndex((ex) => ex.id === workoutExerciseId);
              if (currentIndex < activeWorkout.exercises.length - 1) {
                return (
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full h-12 text-lg mt-2"
                    onClick={() => {
                      const nextExercise = activeWorkout.exercises[currentIndex + 1];
                      if (nextExercise) {
                        navigate(`/workout/active/exercise/${nextExercise.id}`);
                      }
                    }}
                  >
                    Next Exercise
                  </Button>
                );
              } else {
                return (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full h-12 text-lg mt-2"
                    onClick={() => navigate('/workout/active')}
                  >
                    Back to Overview
                  </Button>
                );
              }
            })()}
        </div>

        {/* Exercise Details / Reference Section */}
                <Card className="shadow-none p-4">
                  <div className="flex gap-2 justify-between">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        setActiveReferenceTab(
                          activeReferenceTab === "notes" ? "none" : "notes",
                        )
                      }
                    >
                      Notes
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        setActiveReferenceTab(
                          activeReferenceTab === "history" ? "none" : "history",
                        )
                      }
                    >
                      History
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        setActiveReferenceTab(
                          activeReferenceTab === "alternatives" ? "none" : "alternatives",
                        )
                      }
                    >
                      Alternatives
                    </Button>
                  </div>
        
                  {activeReferenceTab !== "none" && (
                                <div className="mt-4 p-3 border rounded-lg bg-muted/20">
                                  {activeReferenceTab === "notes" && (
                                    <p className="text-sm text-muted-foreground text-wrap">
                                      {workoutExercise.exercise.notes ||
                                        "No notes available for this exercise."}
                                    </p>
                                  )}
                                  {activeReferenceTab === "history" && (
                                    <p className="text-sm text-muted-foreground text-wrap">
                                      Workout history coming soon!
                                    </p>
                                  )}
                                  {activeReferenceTab === "alternatives" && (
                                    <p className="text-sm text-muted-foreground text-wrap">
                                      Alternative exercises coming soon!
                                    </p>
                                  )}
                                </div>                  )}
                </Card>
              </div>
        
              {/* Rest Timer */}
              {restTimer.isRunning && (
                <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
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
            </div>
          );
        }
