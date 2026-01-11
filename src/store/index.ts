import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import activeWorkoutReducer from './slices/activeWorkoutSlice';
import uiReducer from './slices/uiSlice';
import { activeWorkoutApi } from './api/activeWorkoutApi';
import { exerciseApi } from './api/exerciseApi';
import { historyApi } from './api/historyApi';
import { templateApi } from './api/templateApi';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    activeWorkout: activeWorkoutReducer,
    [activeWorkoutApi.reducerPath]: activeWorkoutApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      activeWorkoutApi.middleware,
      exerciseApi.middleware,
      historyApi.middleware,
      templateApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
