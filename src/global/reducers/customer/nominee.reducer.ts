import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface NomineeState {
  isReady: boolean;
}

const initialState: NomineeState = {
  isReady: false,
};

export const nomineeSlice = createSlice({
  name: "nominee",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = nomineeSlice.actions;

export default nomineeSlice.reducer;
