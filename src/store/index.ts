import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import activeWorkoutReducer from './slices/activeWorkoutSlice';
import exercisesReducer from './slices/exercisesSlice';
import workoutHistoryReducer from './slices/workoutHistorySlice';

export const store = configureStore({
  reducer: {
    activeWorkout: activeWorkoutReducer,
    exercises: exercisesReducer,
    workoutHistory: workoutHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
