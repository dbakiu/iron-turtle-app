import { createSlice } from '@reduxjs/toolkit';

interface ActiveWorkoutState {
  // Define your state here
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ActiveWorkoutState = {
  status: 'idle',
  error: null,
};

const activeWorkoutSlice = createSlice({
  name: 'activeWorkout',
  initialState,
  reducers: {
    // Define your reducers here
  },
});

export const { reducer } = activeWorkoutSlice;
export default activeWorkoutSlice.reducer;
