import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrimaryMuscleGroup, MovementPattern, Equipment, TemplateTag } from '@/types/workout';

// UI-only ephemeral state - filters, overlays, timers, etc.
// This state is not persisted and resets on page refresh

interface ExerciseFiltersState {
  muscleGroups: PrimaryMuscleGroup[];
  movementPatterns: MovementPattern[];
  equipment: Equipment[];
  searchQuery: string;
}

interface TemplateFiltersState {
  tags: TemplateTag[];
  searchQuery: string;
}

interface RestTimerState {
  seconds: number;
  isRunning: boolean;
  defaultDuration: number;
}

interface OverlaysState {
  exerciseCreator: boolean;
  templateCreator: boolean;
  exerciseSelector: boolean;
  exerciseSwap: { isOpen: boolean; exerciseId: string | null };
}

interface UiState {
  exerciseFilters: ExerciseFiltersState;
  templateFilters: TemplateFiltersState;
  restTimer: RestTimerState;
  overlays: OverlaysState;
  workoutDuration: number; // Seconds since workout started (UI-tracked)
  activeExerciseId: string | null;
}

const initialState: UiState = {
  exerciseFilters: {
    muscleGroups: [],
    movementPatterns: [],
    equipment: [],
    searchQuery: '',
  },
  templateFilters: {
    tags: [],
    searchQuery: '',
  },
  restTimer: {
    seconds: 0,
    isRunning: false,
    defaultDuration: 60,
  },
  overlays: {
    exerciseCreator: false,
    templateCreator: false,
    exerciseSelector: false,
    exerciseSwap: { isOpen: false, exerciseId: null },
  },
  workoutDuration: 0,
  activeExerciseId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ... (keep existing reducers)

    // Active exercise
    setActiveExerciseId: (state, action: PayloadAction<string | null>) => {
      state.activeExerciseId = action.payload;
    },
    
    // Exercise filters
    setExerciseMuscleGroupFilter: (state, action: PayloadAction<PrimaryMuscleGroup[]>) => {
      state.exerciseFilters.muscleGroups = action.payload;
    },
    setExerciseMovementPatternFilter: (state, action: PayloadAction<MovementPattern[]>) => {
      state.exerciseFilters.movementPatterns = action.payload;
    },
    setExerciseEquipmentFilter: (state, action: PayloadAction<Equipment[]>) => {
      state.exerciseFilters.equipment = action.payload;
    },
    setExerciseSearchQuery: (state, action: PayloadAction<string>) => {
      state.exerciseFilters.searchQuery = action.payload;
    },
    clearExerciseFilters: (state) => {
      state.exerciseFilters = initialState.exerciseFilters;
    },
    toggleExerciseMuscleGroup: (state, action: PayloadAction<PrimaryMuscleGroup>) => {
      const index = state.exerciseFilters.muscleGroups.indexOf(action.payload);
      if (index === -1) {
        state.exerciseFilters.muscleGroups.push(action.payload);
      } else {
        state.exerciseFilters.muscleGroups.splice(index, 1);
      }
    },
    toggleExerciseMovementPattern: (state, action: PayloadAction<MovementPattern>) => {
      const index = state.exerciseFilters.movementPatterns.indexOf(action.payload);
      if (index === -1) {
        state.exerciseFilters.movementPatterns.push(action.payload);
      } else {
        state.exerciseFilters.movementPatterns.splice(index, 1);
      }
    },
    toggleExerciseEquipment: (state, action: PayloadAction<Equipment>) => {
      const index = state.exerciseFilters.equipment.indexOf(action.payload);
      if (index === -1) {
        state.exerciseFilters.equipment.push(action.payload);
      } else {
        state.exerciseFilters.equipment.splice(index, 1);
      }
    },
    
    // Template filters
    setTemplateTagFilter: (state, action: PayloadAction<TemplateTag[]>) => {
      state.templateFilters.tags = action.payload;
    },
    setTemplateSearchQuery: (state, action: PayloadAction<string>) => {
      state.templateFilters.searchQuery = action.payload;
    },
    clearTemplateFilters: (state) => {
      state.templateFilters = initialState.templateFilters;
    },
    toggleTemplateTag: (state, action: PayloadAction<TemplateTag>) => {
      const index = state.templateFilters.tags.indexOf(action.payload);
      if (index === -1) {
        state.templateFilters.tags.push(action.payload);
      } else {
        state.templateFilters.tags.splice(index, 1);
      }
    },
    
    // Rest timer
    startRestTimer: (state, action: PayloadAction<number | undefined>) => {
      state.restTimer.seconds = action.payload ?? state.restTimer.defaultDuration;
      state.restTimer.isRunning = true;
    },
    tickRestTimer: (state) => {
      if (state.restTimer.isRunning && state.restTimer.seconds > 0) {
        state.restTimer.seconds -= 1;
      }
      if (state.restTimer.seconds <= 0) {
        state.restTimer.isRunning = false;
      }
    },
    stopRestTimer: (state) => {
      state.restTimer.isRunning = false;
      state.restTimer.seconds = 0;
    },
    addRestTime: (state, action: PayloadAction<number>) => {
      state.restTimer.seconds += action.payload;
      state.restTimer.isRunning = true;
    },
    setDefaultRestDuration: (state, action: PayloadAction<number>) => {
      state.restTimer.defaultDuration = action.payload;
    },
    
    // Overlays
    openExerciseCreator: (state) => {
      state.overlays.exerciseCreator = true;
    },
    closeExerciseCreator: (state) => {
      state.overlays.exerciseCreator = false;
    },
    openTemplateCreator: (state) => {
      state.overlays.templateCreator = true;
    },
    closeTemplateCreator: (state) => {
      state.overlays.templateCreator = false;
    },
    openExerciseSelector: (state) => {
      state.overlays.exerciseSelector = true;
    },
    closeExerciseSelector: (state) => {
      state.overlays.exerciseSelector = false;
    },
    openExerciseSwap: (state, action: PayloadAction<string>) => {
      state.overlays.exerciseSwap = { isOpen: true, exerciseId: action.payload };
    },
    closeExerciseSwap: (state) => {
      state.overlays.exerciseSwap = { isOpen: false, exerciseId: null };
    },
    
    // Workout duration
    tickWorkoutDuration: (state) => {
      state.workoutDuration += 1;
    },
    resetWorkoutDuration: (state) => {
      state.workoutDuration = 0;
    },
  },
});

export const {
  setActiveExerciseId,
  setExerciseMuscleGroupFilter,
  setExerciseMovementPatternFilter,
  setExerciseEquipmentFilter,
  setExerciseSearchQuery,
  clearExerciseFilters,
  toggleExerciseMuscleGroup,
  toggleExerciseMovementPattern,
  toggleExerciseEquipment,
  setTemplateTagFilter,
  setTemplateSearchQuery,
  clearTemplateFilters,
  toggleTemplateTag,
  startRestTimer,
  tickRestTimer,
  stopRestTimer,
  addRestTime,
  setDefaultRestDuration,
  openExerciseCreator,
  closeExerciseCreator,
  openTemplateCreator,
  closeTemplateCreator,
  openExerciseSelector,
  closeExerciseSelector,
  openExerciseSwap,
  closeExerciseSwap,
  tickWorkoutDuration,
  resetWorkoutDuration,
} = uiSlice.actions;

export default uiSlice.reducer;
