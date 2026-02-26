import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LeadAssignmentState {
  isReady: boolean;
}

const initialState: LeadAssignmentState = {
  isReady: false,
};

export const leadAssignmentSlice = createSlice({
  name: "leadAssignment",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = leadAssignmentSlice.actions;

export default leadAssignmentSlice.reducer;
