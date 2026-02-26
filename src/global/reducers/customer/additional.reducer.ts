import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AdditionalOptionalState {
  isReady: boolean;
}

const initialState: AdditionalOptionalState = {
  isReady: false,
};

export const additionalSlice = createSlice({
  name: "additional",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = additionalSlice.actions;

export default additionalSlice.reducer;
