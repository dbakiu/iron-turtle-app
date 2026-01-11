import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Exercise, PrimaryMuscleGroup, MovementPattern, Equipment } from '@/types/workout';
import { presetExercises } from '@/data/presetExercises';

// Simulated database
let exercisesDb: Exercise[] = [...presetExercises];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface ExerciseFilters {
  muscleGroups?: PrimaryMuscleGroup[];
  movementPatterns?: MovementPattern[];
  equipment?: Equipment[];
  search?: string;
  showPresetsOnly?: boolean;
}

export const exerciseApi = createApi({
  reducerPath: 'exerciseApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Exercise'],
  endpoints: (builder) => ({
    getExercises: builder.query<Exercise[], ExerciseFilters | void>({
      queryFn: async (filters) => {
        await delay(100);
        
        let result = [...exercisesDb];
        
        if (filters) {
          // Filter by muscle groups (OR within category)
          if (filters.muscleGroups && filters.muscleGroups.length > 0) {
            result = result.filter(e => 
              filters.muscleGroups!.includes(e.primary_muscle_group)
            );
          }
          
          // Filter by movement patterns (OR within category)
          if (filters.movementPatterns && filters.movementPatterns.length > 0) {
            result = result.filter(e => 
              e.movement_pattern && filters.movementPatterns!.includes(e.movement_pattern)
            );
          }
          
          // Filter by equipment (OR within category)
          if (filters.equipment && filters.equipment.length > 0) {
            result = result.filter(e => 
              e.equipment.some(eq => filters.equipment!.includes(eq))
            );
          }
          
          // Search filter
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(e => 
              e.name.toLowerCase().includes(searchLower) ||
              e.notes?.toLowerCase().includes(searchLower)
            );
          }
          
          // Presets only filter
          if (filters.showPresetsOnly) {
            result = result.filter(e => e.is_preset);
          }
        }
        
        return { data: result };
      },
      providesTags: ['Exercise'],
    }),
    
    getExerciseById: builder.query<Exercise | undefined, string>({
      queryFn: async (id) => {
        await delay(50);
        const exercise = exercisesDb.find(e => e.id === id);
        return { data: exercise };
      },
      providesTags: (_result, _error, id) => [{ type: 'Exercise', id }],
    }),
    
    createExercise: builder.mutation<Exercise, Omit<Exercise, 'id'>>({
      queryFn: async (newExercise) => {
        await delay(150);
        const exercise: Exercise = {
          ...newExercise,
          id: `custom-${Date.now()}`,
          is_preset: false,
        };
        exercisesDb.push(exercise);
        return { data: exercise };
      },
      invalidatesTags: ['Exercise'],
    }),
    
    updateExercise: builder.mutation<Exercise, Exercise>({
      queryFn: async (updatedExercise) => {
        await delay(150);
        const index = exercisesDb.findIndex(e => e.id === updatedExercise.id);
        if (index !== -1) {
          exercisesDb[index] = updatedExercise;
          return { data: updatedExercise };
        }
        return { error: { status: 404, data: 'Exercise not found' } };
      },
      invalidatesTags: (_result, _error, exercise) => [{ type: 'Exercise', id: exercise.id }],
    }),
    
    deleteExercise: builder.mutation<void, string>({
      queryFn: async (id) => {
        await delay(100);
        exercisesDb = exercisesDb.filter(e => e.id !== id);
        return { data: undefined };
      },
      invalidatesTags: ['Exercise'],
    }),
  }),
});

export const {
  useGetExercisesQuery,
  useGetExerciseByIdQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} = exerciseApi;
