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

export const customerOnboardViewSlice = createSlice({
  name: "customerOnboard",
  initialState,
  reducers: {
    setCustomerOnboardViewState: (
      state,
      action: PayloadAction<CustomerOnboard>
    ) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.title = action.payload.title;
    },
    resetCustomerOnboardViewState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.title = null;
    },
  },
});

export const { resetCustomerOnboardViewState, setCustomerOnboardViewState } =
  customerOnboardViewSlice.actions;

export default customerOnboardViewSlice.reducer;
