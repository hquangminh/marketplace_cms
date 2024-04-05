import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'redux/store';

const initialState: { count: number } = {
  count: 0,
};

export const notifyCountSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    // Initial notify
    initialNotifyCount(state, action) {
      state.count = action.payload;
    },

    // Calculator
    calculatorCount(state, action) {
      state.count = action.payload;
    },
  },
});

export const { calculatorCount, initialNotifyCount } = notifyCountSlice.actions;

export const selectNotifyCountState = (state: RootState) => state.count;

export default notifyCountSlice.reducer;
