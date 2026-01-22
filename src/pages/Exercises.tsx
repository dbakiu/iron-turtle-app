import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, X, Plus, Play, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetExercisesQuery } from '@/store/api/exerciseApi';
import { useAddExerciseToWorkoutMutation, useGetActiveWorkoutQuery } from '@/store/api/activeWorkoutApi';
import { Exercise, PrimaryMuscleGroup, MovementPattern, PRIMARY_MUSCLE_GROUP_LABELS, MOVEMENT_PATTERN_LABELS, EQUIPMENT_LABELS, isIsometricExercise } from '@/types/workout';
import { useAppDispatch, useAppSelector } from '@/store';
import { openExerciseCreator, toggleExerciseMuscleGroup, toggleExerciseMovementPattern, setExerciseSearchQuery, clearExerciseFilters } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

export default function Exercises() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { muscleGroups, movementPatterns, searchQuery } = useAppSelector(state => state.ui.exerciseFilters);
  const [showFilters, setShowFilters] = useState(false);
  
  const [showPresetsOnly, setShowPresetsOnly] = useState<boolean | undefined>(undefined);
  
  const { data: exercises = [], isLoading } = useGetExercisesQuery({
    muscleGroups: muscleGroups.length > 0 ? muscleGroups : undefined,
    movementPatterns: movementPatterns.length > 0 ? movementPatterns : undefined,
    search: searchQuery || undefined,
    showPresetsOnly: showPresetsOnly,
  });
  
  const { data: activeWorkout } = useGetActiveWorkoutQuery();
  const [addExerciseToWorkout] = useAddExerciseToWorkoutMutation();

  const handleAddToWorkout = async (exercise: Exercise) => {
    if (!activeWorkout) {
      toast({
        title: "No active workout",
        description: "Start a workout first to add exercises",
        variant: "destructive",
      });
      return;
    }
    
    await addExerciseToWorkout({
      id: `temp-${Date.now()}`,
      exercise,
      order: activeWorkout.exercises.length,
      sets: [{
        id: `temp-set-${Date.now()}`,
        exercise_id: exercise.id,
        set_type: 'WORKING',
        weight: 0,
        reps: 0,
        is_completed: false,
      }],
    });
    
    toast({
      title: "Exercise added",
      description: `${exercise.name} added to your workout`,
    });
    navigate('/workout/active');
  };

  const activeFiltersCount = muscleGroups.length + movementPatterns.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 max-w-lg mx-auto pb-24">
        {/* Header */}
        <header className="pt-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Exercise Library</h1>
            <p className="text-muted-foreground">{exercises.length} exercises available</p>
          </div>
          <Link to="/exercises/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </Link>
        </header>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => dispatch(setExerciseSearchQuery(e.target.value))}
              className="pl-10"
            />
          </div>
          
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => dispatch(clearExerciseFilters())}>
                      Clear all
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Preset/Custom Filter */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase text-sm tracking-wide">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowPresetsOnly(undefined)}
                      className={cn(
                        showPresetsOnly === undefined ? 'tag-pill-active' : 'tag-pill-inactive'
                      )}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setShowPresetsOnly(true)}
                      className={cn(
                        showPresetsOnly === true ? 'tag-pill-active' : 'tag-pill-inactive'
                      )}
                    >
                      Preset
                    </button>
                    <button
                      onClick={() => setShowPresetsOnly(false)}
                      className={cn(
                        showPresetsOnly === false ? 'tag-pill-active' : 'tag-pill-inactive'
                      )}
                    >
                      Custom
                    </button>
                  </div>
                </div>
                {/* Muscle Groups */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase text-sm tracking-wide">Muscle Groups</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(PRIMARY_MUSCLE_GROUP_LABELS) as PrimaryMuscleGroup[]).map((muscle) => (
                      <button
                        key={muscle}
                        onClick={() => dispatch(toggleExerciseMuscleGroup(muscle))}
                        className={cn(
                          muscleGroups.includes(muscle) ? 'tag-pill-active' : 'tag-pill-inactive'
                        )}
                      >
                        {PRIMARY_MUSCLE_GROUP_LABELS[muscle]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Movement Patterns */}
                <div>
                  <h3 className="font-semibold mb-3 uppercase text-sm tracking-wide">Movement Patterns</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(MOVEMENT_PATTERN_LABELS) as MovementPattern[]).map((pattern) => (
                      <button
                        key={pattern}
                        onClick={() => dispatch(toggleExerciseMovementPattern(pattern))}
                        className={cn(
                          movementPatterns.includes(pattern) ? 'tag-pill-active' : 'tag-pill-inactive'
                        )}
                      >
                        {MOVEMENT_PATTERN_LABELS[pattern]}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle) => (
              <Badge 
                key={muscle} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => dispatch(toggleExerciseMuscleGroup(muscle))}
              >
                {PRIMARY_MUSCLE_GROUP_LABELS[muscle]}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {movementPatterns.map((pattern) => (
              <Badge 
                key={pattern} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => dispatch(toggleExerciseMovementPattern(pattern))}
              >
                {MOVEMENT_PATTERN_LABELS[pattern]}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}

        {/* Exercise List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="stat-card text-center py-12">
              <p className="text-muted-foreground">Loading exercises...</p>
            </div>
          ) : exercises.length === 0 ? (
            <div className="stat-card text-center py-12">
              <p className="text-muted-foreground">No exercises found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            exercises.map((exercise) => (
              <ExerciseListItem 
                key={exercise.id} 
                exercise={exercise}
                onAdd={() => handleAddToWorkout(exercise)}
                showAddButton={!!activeWorkout}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}

interface ExerciseListItemProps {
  exercise: Exercise;
  onAdd: () => void;
  showAddButton: boolean;
}

function ExerciseListItem({ exercise, onAdd, showAddButton }: ExerciseListItemProps) {
  return (
    <div className="stat-card hover:bg-accent/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{exercise.name}</h3>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {PRIMARY_MUSCLE_GROUP_LABELS[exercise.primary_muscle_group]}
            </span>
            {exercise.movement_pattern && (
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                {MOVEMENT_PATTERN_LABELS[exercise.movement_pattern]}
              </span>
            )}
            <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
              {exercise.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}
            </span>
          </div>
        </div>

        {showAddButton && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onAdd}
            className="shrink-0 ml-2 hover:bg-primary/20 hover:text-primary"
          >
            <Plus className="w-5 h-5" />
          </Button>
        )}
      </div>
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
        <Link to="/workout/active" className="nav-link flex-1">
          <Play className="w-5 h-5" />
          <span className="text-xs font-medium">Workout</span>
        </Link>
        <Link to="/exercises" className="nav-link-active flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Exercises</span>
        </Link>
      </div>
    </nav>
  );
}
