import { useState, useMemo } from 'react';
import { Search, Filter, Plus, X, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Exercise,
  PrimaryMuscleGroup,
  MovementPattern,
  Equipment,
  PRIMARY_MUSCLE_GROUP_LABELS,
  MOVEMENT_PATTERN_LABELS,
  EQUIPMENT_LABELS,
} from '@/types/workout';
import { useGetExercisesQuery } from '@/store/api/exerciseApi';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setExerciseSearchQuery,
  toggleExerciseMuscleGroup,
  toggleExerciseMovementPattern,
  toggleExerciseEquipment,
  clearExerciseFilters,
} from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

interface ExerciseSelectorProps {
  onSelect: (exercises: Exercise[]) => void;
  onClose: () => void;
  initialSelectedExerciseIds?: string[];
}

export function ExerciseSelector({ onSelect, onClose, initialSelectedExerciseIds = [] }: ExerciseSelectorProps) {
  const dispatch = useAppDispatch();
  const { muscleGroups, movementPatterns, equipment, searchQuery } = useAppSelector(state => state.ui.exerciseFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showPresetsOnly, setShowPresetsOnly] = useState<boolean | undefined>(undefined);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const { data: exercises = [], isLoading } = useGetExercisesQuery({
    muscleGroups: muscleGroups.length > 0 ? muscleGroups : undefined,
    movementPatterns: movementPatterns.length > 0 ? movementPatterns : undefined,
    equipment: equipment.length > 0 ? equipment : undefined,
    search: searchQuery || undefined,
    showPresetsOnly: showPresetsOnly,
  });

  // Initialize selected exercises if provided
  useMemo(() => {
    if (exercises.length > 0 && initialSelectedExerciseIds.length > 0) {
      const initialSelection = exercises.filter(ex => initialSelectedExerciseIds.includes(ex.id));
      setSelectedExercises(initialSelection);
    }
  }, [exercises, initialSelectedExerciseIds]);

  const handleToggleExercise = (exercise: Exercise) => {
    setSelectedExercises(prev =>
      prev.find(ex => ex.id === exercise.id)
        ? prev.filter(ex => ex.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const handleDone = () => {
    onSelect(selectedExercises);
    onClose();
  };

  const activeFiltersCount = muscleGroups.length + movementPatterns.length + equipment.length + (showPresetsOnly !== undefined ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-0 top-0 h-full w-full max-w-lg bg-background border-r flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg font-semibold">Select Exercises</h2>
          <Button onClick={handleDone} disabled={selectedExercises.length === 0}>
            <Check className="w-5 h-5 mr-2" />
            Done ({selectedExercises.length})
          </Button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {/* Search and Filter */}
          <div className="flex gap-2 mb-4">
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

                  {/* Equipment */}
                  <div>
                    <h3 className="font-semibold mb-3 uppercase text-sm tracking-wide">Equipment</h3>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(EQUIPMENT_LABELS) as Equipment[]).map((eq) => (
                        <button
                          key={eq}
                          onClick={() => dispatch(toggleExerciseEquipment(eq))}
                          className={cn(
                            equipment.includes(eq) ? 'tag-pill-active' : 'tag-pill-inactive'
                          )}
                        >
                          {EQUIPMENT_LABELS[eq]}
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
            <div className="flex flex-wrap gap-2 mb-4">
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
              {equipment.map((eq) => (
                <Badge 
                  key={eq} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => dispatch(toggleExerciseEquipment(eq))}
                >
                  {EQUIPMENT_LABELS[eq]}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {showPresetsOnly !== undefined && (
                <Badge 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setShowPresetsOnly(undefined)}
                >
                  {showPresetsOnly ? 'Preset Only' : 'Custom Only'}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
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
                <div 
                  key={exercise.id} 
                  className={cn(
                    "stat-card hover:bg-accent/30 transition-colors cursor-pointer",
                    selectedExercises.find(ex => ex.id === exercise.id) && "bg-primary/20"
                  )}
                  onClick={() => handleToggleExercise(exercise)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{exercise.name}</h3>
                    {selectedExercises.find(ex => ex.id === exercise.id) && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
