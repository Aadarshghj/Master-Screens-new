import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface KycState {
  isReady: boolean;
}

const initialState: KycState = {
  isReady: false,
};

export const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = kycSlice.actions;

export default kycSlice.reducer;
