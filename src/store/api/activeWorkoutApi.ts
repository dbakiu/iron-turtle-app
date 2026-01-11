import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Workout, WorkoutExercise, WorkoutSet } from '@/types/workout';

// Simulated active workout (exactly one globally per user)
let activeWorkoutDb: Workout | null = null;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate server-issued UUID
const generateUUID = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

export const activeWorkoutApi = createApi({
  reducerPath: 'activeWorkoutApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['ActiveWorkout'],
  endpoints: (builder) => ({
    getActiveWorkout: builder.query<Workout | null, void>({
      queryFn: async () => {
        await delay(50);
        return { data: activeWorkoutDb };
      },
      providesTags: ['ActiveWorkout'],
    }),
    
    startWorkout: builder.mutation<Workout, { name: string; template_id?: string; exercises?: WorkoutExercise[] }>({
      queryFn: async ({ name, template_id, exercises = [] }) => {
        await delay(100);
        
        // Wipe any existing active workout
        activeWorkoutDb = {
          id: generateUUID(),
          name,
          template_id,
          started_at: new Date().toISOString(),
          exercises: exercises.map((ex, index) => ({
            ...ex,
            id: generateUUID(),
            order: index,
            sets: ex.sets.map(set => ({
              ...set,
              id: generateUUID(),
              sync_status: 'synced' as const,
            })),
          })),
        };
        
        return { data: activeWorkoutDb };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    addExerciseToWorkout: builder.mutation<WorkoutExercise, WorkoutExercise>({
      queryFn: async (exercise) => {
        await delay(100);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        const newExercise: WorkoutExercise = {
          ...exercise,
          id: generateUUID(),
          order: activeWorkoutDb.exercises.length,
          sets: exercise.sets.map(set => ({
            ...set,
            id: generateUUID(),
            sync_status: 'synced' as const,
          })),
        };
        
        activeWorkoutDb.exercises.push(newExercise);
        return { data: newExercise };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    removeExerciseFromWorkout: builder.mutation<void, string>({
      queryFn: async (exerciseId) => {
        await delay(50);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        activeWorkoutDb.exercises = activeWorkoutDb.exercises.filter(e => e.id !== exerciseId);
        activeWorkoutDb.exercises.forEach((e, i) => { e.order = i; });
        
        return { data: undefined };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    reorderExercises: builder.mutation<void, { exerciseIds: string[] }>({
      queryFn: async ({ exerciseIds }) => {
        await delay(50);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        const reordered = exerciseIds.map((id, index) => {
          const exercise = activeWorkoutDb!.exercises.find(e => e.id === id);
          if (exercise) {
            return { ...exercise, order: index };
          }
          return null;
        }).filter(Boolean) as WorkoutExercise[];
        
        activeWorkoutDb.exercises = reordered;
        return { data: undefined };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    addSet: builder.mutation<WorkoutSet, { exerciseId: string; set: Omit<WorkoutSet, 'id' | 'sync_status'> }>({
      queryFn: async ({ exerciseId, set }) => {
        await delay(100);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        const exercise = activeWorkoutDb.exercises.find(e => e.id === exerciseId);
        if (!exercise) {
          return { error: { status: 404, data: 'Exercise not found' } };
        }
        
        const newSet: WorkoutSet = {
          ...set,
          id: generateUUID(),
          sync_status: 'synced',
        };
        
        exercise.sets.push(newSet);
        return { data: newSet };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    updateSet: builder.mutation<WorkoutSet, { exerciseId: string; setId: string; updates: Partial<WorkoutSet> }>({
      queryFn: async ({ exerciseId, setId, updates }) => {
        await delay(50);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        const exercise = activeWorkoutDb.exercises.find(e => e.id === exerciseId);
        if (!exercise) {
          return { error: { status: 404, data: 'Exercise not found' } };
        }
        
        const set = exercise.sets.find(s => s.id === setId);
        if (!set) {
          return { error: { status: 404, data: 'Set not found' } };
        }
        
        Object.assign(set, updates, { sync_status: 'synced' });
        return { data: set };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    completeSet: builder.mutation<WorkoutSet, { exerciseId: string; setId: string }>({
      queryFn: async ({ exerciseId, setId }) => {
        await delay(100);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        const exercise = activeWorkoutDb.exercises.find(e => e.id === exerciseId);
        if (!exercise) {
          return { error: { status: 404, data: 'Exercise not found' } };
        }
        
        const set = exercise.sets.find(s => s.id === setId);
        if (!set) {
          return { error: { status: 404, data: 'Set not found' } };
        }
        
        set.is_completed = true;
        set.completed_at = new Date().toISOString();
        set.sync_status = 'synced';
        
        return { data: set };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    removeSet: builder.mutation<void, { exerciseId: string; setId: string }>({
      queryFn: async ({ exerciseId, setId }) => {
        await delay(50);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        const exercise = activeWorkoutDb.exercises.find(e => e.id === exerciseId);
        if (!exercise) {
          return { error: { status: 404, data: 'Exercise not found' } };
        }
        
        exercise.sets = exercise.sets.filter(s => s.id !== setId);
        return { data: undefined };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    finishWorkout: builder.mutation<Workout, void>({
      queryFn: async () => {
        await delay(100);
        
        if (!activeWorkoutDb) {
          return { error: { status: 400, data: 'No active workout' } };
        }
        
        // Filter out incomplete exercises/sets for final snapshot
        const completedWorkout: Workout = {
          ...activeWorkoutDb,
          finished_at: new Date().toISOString(),
          exercises: activeWorkoutDb.exercises
            .filter(e => e.sets.some(s => s.is_completed))
            .map(e => ({
              ...e,
              sets: e.sets.filter(s => s.is_completed),
            })),
        };
        
        activeWorkoutDb = null;
        return { data: completedWorkout };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
    
    discardWorkout: builder.mutation<void, void>({
      queryFn: async () => {
        await delay(50);
        activeWorkoutDb = null;
        return { data: undefined };
      },
      invalidatesTags: ['ActiveWorkout'],
    }),
  }),
});

export const {
  useGetActiveWorkoutQuery,
  useStartWorkoutMutation,
  useAddExerciseToWorkoutMutation,
  useRemoveExerciseFromWorkoutMutation,
  useReorderExercisesMutation,
  useAddSetMutation,
  useUpdateSetMutation,
  useCompleteSetMutation,
  useRemoveSetMutation,
  useFinishWorkoutMutation,
  useDiscardWorkoutMutation,
} = activeWorkoutApi;
