import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Dumbbell, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateExerciseMutation } from '@/store/api/exerciseApi';
import {
  Exercise,
  PrimaryMuscleGroup,
  PrimaryMuscle,
  MovementPattern,
  Equipment,
  Difficulty,
  PRIMARY_MUSCLE_GROUP_LABELS,
  PRIMARY_MUSCLE_LABELS,
  MOVEMENT_PATTERN_LABELS,
  EQUIPMENT_LABELS,
} from '@/types/workout';
import { useToast } from '@/hooks/use-toast';

const primaryMuscleGroups: PrimaryMuscleGroup[] = ['LEGS', 'CHEST', 'BACK', 'ARMS', 'CORE', 'SHOULDERS'];
const primaryMuscles: PrimaryMuscle[] = ['QUADS', 'HAMSTRINGS', 'GLUTES', 'CALVES', 'PECS', 'LATS', 'TRAPS', 'RHOMBOIDS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'ANTERIOR_DELTS', 'LATERAL_DELTS', 'REAR_DELTS', 'ABS', 'OBLIQUES', 'LOWER_BACK'];
const movementPatterns: MovementPattern[] = ['SQUAT', 'HINGE', 'HORIZONTAL_PUSH', 'HORIZONTAL_PULL', 'VERTICAL_PUSH', 'VERTICAL_PULL', 'ISOLATION', 'CORE'];
const equipment: Equipment[] = ['BARBELL', 'DUMBBELL', 'CABLE', 'MACHINE', 'BODYWEIGHT', 'KETTLEBELL', 'BANDS', 'OTHER'];
const difficulties: Difficulty[] = [1, 2, 3];

const exerciseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  primary_muscle_group: z.enum(primaryMuscleGroups),
  primary_muscle: z.enum(primaryMuscles).optional(),
  movement_pattern: z.enum(movementPatterns).optional(),
  equipment: z.array(z.enum(equipment)).min(1, 'At least one equipment type is required'),
  difficulty: z.coerce.number().min(1).max(3).optional(),
  notes: z.string().optional(),
});

type ExerciseFormData = z.infer<typeof exerciseSchema>;

export function ExerciseCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createExercise, { isLoading }] = useCreateExerciseMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      equipment: [],
    },
  });

  const onSubmit = async (data: ExerciseFormData) => {
    const newExercise: Omit<Exercise, 'id' | 'is_preset'> = {
      ...data,
      difficulty: data.difficulty as Difficulty | undefined,
    };
    try {
      await createExercise(newExercise).unwrap();
      toast({
        title: 'Exercise created',
        description: `${data.name} has been added to your exercise library.`,
      });
      navigate('/exercises');
    } catch (error) {
      toast({
        title: 'Error creating exercise',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 max-w-lg mx-auto pb-24">
        <header className="pt-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Exercise</h1>
          <Button variant="ghost" size="icon" onClick={() => navigate('/exercises')}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} id="name" />}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Primary Muscle Group */}
          <div>
            <label htmlFor="primary_muscle_group" className="block text-sm font-medium mb-1">Primary Muscle Group</label>
            <Controller
              name="primary_muscle_group"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryMuscleGroups.map((group) => (
                      <SelectItem key={group} value={group}>{PRIMARY_MUSCLE_GROUP_LABELS[group]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
             {errors.primary_muscle_group && <p className="text-destructive text-sm mt-1">{errors.primary_muscle_group.message}</p>}
          </div>
          
          {/* Primary Muscle */}
          <div>
            <label htmlFor="primary_muscle" className="block text-sm font-medium mb-1">Primary Muscle</label>
            <Controller
              name="primary_muscle"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a muscle (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryMuscles.map((muscle) => (
                      <SelectItem key={muscle} value={muscle}>{PRIMARY_MUSCLE_LABELS[muscle]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Movement Pattern */}
          <div>
            <label htmlFor="movement_pattern" className="block text-sm font-medium mb-1">Movement Pattern</label>
            <Controller
              name="movement_pattern"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a pattern (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {movementPatterns.map((pattern) => (
                      <SelectItem key={pattern} value={pattern}>{MOVEMENT_PATTERN_LABELS[pattern]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Difficulty */}
           <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Difficulty</label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty.toString()}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium mb-2">Equipment</label>
            <div className="grid grid-cols-2 gap-2">
              {equipment.map((equip) => (
                <Controller
                  key={equip}
                  name="equipment"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`equipment-${equip}`}
                        checked={field.value?.includes(equip)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...(field.value || []), equip]
                            : (field.value || []).filter((value) => value !== equip);
                          field.onChange(newValue);
                        }}
                      />
                      <label htmlFor={`equipment-${equip}`} className="text-sm font-medium leading-none">
                        {EQUIPMENT_LABELS[equip]}
                      </label>
                    </div>
                  )}
                />
              ))}
            </div>
            {errors.equipment && <p className="text-destructive text-sm mt-1">{errors.equipment.message}</p>}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => <Textarea {...field} id="notes" />}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Exercise'}
            </Button>
          </div>
        </form>
      </div>
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
