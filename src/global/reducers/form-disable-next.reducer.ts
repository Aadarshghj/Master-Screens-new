import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CustomerOnboard {
  disableNext: boolean;
  disableReason: string | null;
  title?: string | null;
}

const initialState: CustomerOnboard = {
  disableNext: false,
  disableReason: null,
  title: null,
};

export const formDisableNextSlice = createSlice({
  name: "formDisableNext",
  initialState,
  reducers: {
    setDisableNextState: (state, action: PayloadAction<CustomerOnboard>) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.title = action.payload.title;
    },
    resetDisableNextState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.title = null;
    },
  },
});

export const { setDisableNextState, resetDisableNextState } =
  formDisableNextSlice.actions;

export default formDisableNextSlice.reducer;
