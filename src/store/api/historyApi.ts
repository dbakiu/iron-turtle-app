import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Workout, LastSessionData } from '@/types/workout';

// Simulated workout history database
let historyDb: Workout[] = [];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const historyApi = createApi({
  reducerPath: 'historyApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['History', 'LastSession'],
  endpoints: (builder) => ({
    getWorkoutHistory: builder.query<Workout[], { limit?: number } | void>({
      queryFn: async (params) => {
        await delay(100);
        const limit = (params && 'limit' in params) ? params.limit ?? 50 : 50;
        const result = historyDb.slice(0, limit);
        return { data: result };
      },
      providesTags: ['History'],
    }),
    
    getWorkoutById: builder.query<Workout | undefined, string>({
      queryFn: async (id) => {
        await delay(50);
        const workout = historyDb.find(w => w.id === id);
        return { data: workout };
      },
      providesTags: (_result, _error, id) => [{ type: 'History', id }],
    }),
    
    // Get last session data for a specific exercise (regardless of template)
    getLastSessionForExercise: builder.query<LastSessionData | null, string>({
      queryFn: async (exerciseId) => {
        await delay(50);
        
        // Find the most recent workout containing this exercise
        for (const workout of historyDb) {
          const exercise = workout.exercises.find(e => e.exercise.id === exerciseId);
          if (exercise && exercise.sets.length > 0) {
            return {
              data: {
                exercise_id: exerciseId,
                sets: exercise.sets.map(s => ({
                  weight: s.weight,
                  reps: s.reps,
                  duration: s.duration,
                  set_type: s.set_type,
                })),
                performed_at: workout.finished_at || workout.started_at,
              },
            };
          }
        }
        
        return { data: null };
      },
      providesTags: (_result, _error, exerciseId) => [{ type: 'LastSession', id: exerciseId }],
    }),
    
    // Get last session data for multiple exercises at once
    getLastSessionsForExercises: builder.query<Record<string, LastSessionData>, string[]>({
      queryFn: async (exerciseIds) => {
        await delay(100);
        
        const result: Record<string, LastSessionData> = {};
        
        for (const exerciseId of exerciseIds) {
          for (const workout of historyDb) {
            const exercise = workout.exercises.find(e => e.exercise.id === exerciseId);
            if (exercise && exercise.sets.length > 0) {
              result[exerciseId] = {
                exercise_id: exerciseId,
                sets: exercise.sets.map(s => ({
                  weight: s.weight,
                  reps: s.reps,
                  duration: s.duration,
                  set_type: s.set_type,
                })),
                performed_at: workout.finished_at || workout.started_at,
              };
              break; // Found most recent, move to next exercise
            }
          }
        }
        
        return { data: result };
      },
      providesTags: ['LastSession'],
    }),
    
    saveCompletedWorkout: builder.mutation<Workout, Workout>({
      queryFn: async (workout) => {
        await delay(150);
        // Add to beginning of history (most recent first)
        historyDb.unshift(workout);
        return { data: workout };
      },
      invalidatesTags: ['History', 'LastSession'],
    }),
    
    deleteWorkout: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(100);
        historyDb = historyDb.filter(w => w.id !== id);
        return { data: undefined };
      },
      invalidatesTags: ['History', 'LastSession'],
    }),
  }),
});

export const {
  useGetWorkoutHistoryQuery,
  useGetWorkoutByIdQuery,
  useGetLastSessionForExerciseQuery,
  useGetLastSessionsForExercisesQuery,
  useSaveCompletedWorkoutMutation,
  useDeleteWorkoutMutation,
} = historyApi;
