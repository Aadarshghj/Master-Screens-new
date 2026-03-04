import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BasicInfoState {
  isReady: boolean;
}

const initialState: BasicInfoState = {
  isReady: false,
};

export const basicInfoSlice = createSlice({
  name: "basicInfo",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = basicInfoSlice.actions;
export default basicInfoSlice.reducer;
