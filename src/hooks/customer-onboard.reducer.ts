import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CustomerOnboard {
  disableNext: boolean;
  disableReason: string | null;
  currentPath: string | null;
  title?: string | null;
}

const initialState: CustomerOnboard = {
  disableNext: false,
  disableReason: null,
  currentPath: null,
  title: null,
};

export const customerOnboardSlice = createSlice({
  name: "customerOnboard",
  initialState,
  reducers: {
    setCustomerOnboardState: (
      state,
      action: PayloadAction<CustomerOnboard>
    ) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.currentPath = action.payload.currentPath;
      state.title = action.payload.title;
    },
    resetCustomerOnboardState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.currentPath = null;
      state.title = null;
    },
  },
});

export const { setCustomerOnboardState, resetCustomerOnboardState } =
  customerOnboardSlice.actions;

export default customerOnboardSlice.reducer;
