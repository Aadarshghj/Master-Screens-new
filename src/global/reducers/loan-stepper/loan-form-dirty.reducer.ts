import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoanFormDirty {
  disableNext: boolean;
  disableReason: string | null;
  title?: string | null;
}

const initialState: LoanFormDirty = {
  disableNext: false,
  disableReason: null,
  title: null,
};

export const loanFormDirtySlice = createSlice({
  name: "loanFormDirty",
  initialState,
  reducers: {
    setLoanFormDirtyState: (state, action: PayloadAction<LoanFormDirty>) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.title = action.payload.title;
    },
    resetLoanFormDirtyState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.title = null;
    },
  },
});

export const { setLoanFormDirtyState, resetLoanFormDirtyState } =
  loanFormDirtySlice.actions;

export default loanFormDirtySlice.reducer;
