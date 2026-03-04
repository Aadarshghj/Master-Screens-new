import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoanStepper {
  disableNext: boolean;
  disableReason: string | null;
  currentPath: string | null;
  title?: string | null;
}

const initialState: LoanStepper = {
  disableNext: false,
  disableReason: null,
  currentPath: null,
  title: null,
};

export const loanStepperSlice = createSlice({
  name: "loanStepper",
  initialState,
  reducers: {
    setLoanStepperState: (state, action: PayloadAction<LoanStepper>) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.currentPath = action.payload.currentPath;
      state.title = action.payload.title;
    },
    resetLoanStepperState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.currentPath = null;
      state.title = null;
    },
  },
});

export const { setLoanStepperState, resetLoanStepperState } =
  loanStepperSlice.actions;

export default loanStepperSlice.reducer;
